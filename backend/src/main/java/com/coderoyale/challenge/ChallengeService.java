package com.coderoyale.challenge;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final TestCaseRepository testCaseRepository;

    public ChallengeService(ChallengeRepository challengeRepository, TestCaseRepository testCaseRepository) {
        this.challengeRepository = challengeRepository;
        this.testCaseRepository = testCaseRepository;
    }

    @Transactional(readOnly = true)
    public List<Challenge> getAllActiveChallenges() {
        return challengeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Challenge getChallengeById(String id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found: " + id));

        // Sanitize: Only load visible test cases for public client exposure
        List<TestCase> visibleTestCases = testCaseRepository.findByChallengeIdAndIsHiddenFalseOrderByOrderIndexAsc(id);
        challenge.setTestCases(visibleTestCases);
        return challenge;
    }

    @Transactional(readOnly = true)
    public List<TestCase> getAllTestCasesForEvaluation(String challengeId) {
        // Internal server use only for official submission scoring
        return testCaseRepository.findByChallengeIdOrderByOrderIndexAsc(challengeId);
    }
}
