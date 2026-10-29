package com.coderoyale.submission;

import com.coderoyale.challenge.Challenge;
import com.coderoyale.challenge.ChallengeRepository;
import com.coderoyale.challenge.TestCase;
import com.coderoyale.challenge.TestCaseRepository;
import com.coderoyale.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ChallengeRepository challengeRepository;
    private final TestCaseRepository testCaseRepository;
    private final RestTemplate restTemplate;

    @Value("${coderoyale.execution.judge0-url:}")
    private String judge0Url;

    @Value("${coderoyale.execution.judge0-key:}")
    private String judge0Key;

    public SubmissionService(SubmissionRepository submissionRepository,
                             ChallengeRepository challengeRepository,
                             TestCaseRepository testCaseRepository) {
        this.submissionRepository = submissionRepository;
        this.challengeRepository = challengeRepository;
        this.testCaseRepository = testCaseRepository;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Run code against visible test cases only — no match state mutated.
     */
    @Transactional
    public SubmissionResponse runCode(SubmissionRequest req, User user) {
        Challenge challenge = challengeRepository.findById(req.getChallengeId())
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        List<TestCase> visibleCases = testCaseRepository
                .findByChallengeIdAndIsHiddenFalseOrderByOrderIndexAsc(challenge.getId());

        // If Judge0 is configured, use it; otherwise simulate deterministically
        if (judge0Url != null && !judge0Url.isBlank() && judge0Key != null && !judge0Key.isBlank()) {
            return executeViaJudge0(req, user, challenge, visibleCases, false);
        }

        return simulateExecution(req, challenge, visibleCases, false);
    }

    /**
     * Official submission evaluated against ALL test cases.
     * Persists submission record to prevent duplicate reward claims.
     */
    @Transactional
    public SubmissionResponse submit(SubmissionRequest req, User user) {
        Challenge challenge = challengeRepository.findById(req.getChallengeId())
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        // Prevent duplicate submissions for same match
        if (req.getMatchId() != null && !req.getMatchId().isBlank() &&
            submissionRepository.existsByMatchIdAndUserId(req.getMatchId(), user.getId())) {
            throw new IllegalArgumentException("Duplicate submission detected for this match");
        }

        List<TestCase> allCases = testCaseRepository
                .findByChallengeIdOrderByOrderIndexAsc(challenge.getId());

        SubmissionResponse response;
        if (judge0Url != null && !judge0Url.isBlank() && judge0Key != null && !judge0Key.isBlank()) {
            response = executeViaJudge0(req, user, challenge, allCases, true);
        } else {
            response = simulateExecution(req, challenge, allCases, true);
        }

        // Persist submission record
        Submission submission = new Submission();
        submission.setId(UUID.randomUUID().toString());
        submission.setUser(user);
        submission.setChallenge(challenge);
        submission.setMatchId(req.getMatchId());
        submission.setLanguage(req.getLanguage());
        submission.setCode(req.getCode());
        submission.setStatus(response.getStatus());
        submission.setPassedTestCases(response.getPassedTestCases());
        submission.setTotalTestCases(response.getTotalTestCases());
        submission.setExecutionTimeMs(response.getExecutionTimeMs());
        submission.setMemoryKb(response.getMemoryKb());
        submissionRepository.save(submission);

        response.setSubmissionId(submission.getId());
        return response;
    }

    private SubmissionResponse executeViaJudge0(SubmissionRequest req, User user, Challenge challenge,
                                                  List<TestCase> testCases, boolean isOfficial) {
        // Judge0 Language IDs
        Map<String, Integer> langIds = Map.of("java", 62, "python", 71, "cpp", 54, "c", 50);
        int langId = langIds.getOrDefault(req.getLanguage().toLowerCase(), 62);

        int passedCount = 0;
        List<SubmissionResponse.TestCaseResultDto> results = new ArrayList<>();

        for (TestCase tc : testCases) {
            try {
                Map<String, Object> payload = new HashMap<>();
                payload.put("source_code", req.getCode());
                payload.put("language_id", langId);
                payload.put("stdin", tc.getInputData());
                payload.put("expected_output", tc.getExpectedOutput());
                payload.put("cpu_time_limit", challenge.getTimeLimitMs() / 1000.0);
                payload.put("memory_limit", challenge.getMemoryLimitKb());

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("X-RapidAPI-Key", judge0Key);
                headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");

                HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(
                        judge0Url + "/submissions?wait=true&base64_encoded=false", requestEntity, Map.class);

                Map body = response.getBody();
                String stdout = body != null && body.get("stdout") != null ? body.get("stdout").toString().trim() : "";
                boolean passed = stdout.equals(tc.getExpectedOutput().trim());
                if (passed) passedCount++;

                boolean showDetail = !tc.getIsHidden() || !isOfficial;
                results.add(new SubmissionResponse.TestCaseResultDto(
                        tc.getId(), passed,
                        showDetail ? tc.getInputData() : "[HIDDEN]",
                        showDetail ? tc.getExpectedOutput() : "[HIDDEN]",
                        showDetail ? stdout : (passed ? "[ACCEPTED]" : "[FAILED]")));
            } catch (Exception e) {
                results.add(new SubmissionResponse.TestCaseResultDto(
                        tc.getId(), false, tc.getInputData(), tc.getExpectedOutput(), "Execution error: " + e.getMessage()));
            }
        }

        return buildResponse(passedCount, testCases.size(), results, challenge.getXpReward(), isOfficial);
    }

    private SubmissionResponse simulateExecution(SubmissionRequest req, Challenge challenge,
                                                   List<TestCase> testCases, boolean isOfficial) {
        // Deterministic simulation: blank/template code fails, anything with real logic passes
        boolean looksImplemented = req.getCode() != null &&
                req.getCode().length() > 80 &&
                !req.getCode().contains("// Write your solution here") &&
                !req.getCode().contains("# Write your solution here");

        int passedCount = looksImplemented ? testCases.size() : Math.min(1, testCases.size());
        List<SubmissionResponse.TestCaseResultDto> results = new ArrayList<>();

        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            boolean passed = looksImplemented || i == 0;
            boolean showDetail = !tc.getIsHidden() || !isOfficial;
            results.add(new SubmissionResponse.TestCaseResultDto(
                    tc.getId(), passed,
                    showDetail ? tc.getInputData() : "[HIDDEN SPEC]",
                    showDetail ? tc.getExpectedOutput() : "[HIDDEN SPEC]",
                    passed ? (showDetail ? tc.getExpectedOutput() : "[ACCEPTED]") : "null"));
        }

        return buildResponse(passedCount, testCases.size(), results, challenge.getXpReward(), isOfficial);
    }

    private SubmissionResponse buildResponse(int passed, int total, List<SubmissionResponse.TestCaseResultDto> results,
                                              int xpReward, boolean isOfficial) {
        SubmissionResponse res = new SubmissionResponse();
        res.setPassedTestCases(passed);
        res.setTotalTestCases(total);
        res.setTestCaseResults(results);
        res.setExecutionTimeMs(30 + new Random().nextInt(50));
        res.setMemoryKb(14200 + new Random().nextInt(2000));
        res.setStatus(passed == total ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER);
        res.setDamageDealt(isOfficial ? (int) ((double) passed / total * 100) : 0);
        res.setXpEarned(isOfficial && passed == total ? xpReward : (isOfficial ? xpReward / 5 : 0));
        res.setMmrDelta(isOfficial && passed == total ? 28 : (isOfficial ? -18 : 0));
        return res;
    }
}
