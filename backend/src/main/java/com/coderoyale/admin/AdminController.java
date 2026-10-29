package com.coderoyale.admin;

import com.coderoyale.challenge.Challenge;
import com.coderoyale.challenge.ChallengeRepository;
import com.coderoyale.challenge.TestCase;
import com.coderoyale.challenge.TestCaseRepository;
import com.coderoyale.common.ApiResponse;
import com.coderoyale.user.User;
import com.coderoyale.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ChallengeRepository challengeRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;

    public AdminController(ChallengeRepository challengeRepository,
                           TestCaseRepository testCaseRepository,
                           UserRepository userRepository) {
        this.challengeRepository = challengeRepository;
        this.testCaseRepository = testCaseRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = Map.of(
                "totalChallenges", challengeRepository.count(),
                "totalUsers", userRepository.count(),
                "activeUsers", userRepository.count()
        );
        return ResponseEntity.ok(ApiResponse.ok("Admin stats retrieved", stats));
    }

    @PostMapping("/challenges")
    public ResponseEntity<ApiResponse<Challenge>> createChallenge(@RequestBody Challenge challenge) {
        if (challenge.getId() == null || challenge.getId().isBlank()) {
            challenge.setId(UUID.randomUUID().toString());
        }
        if (challenge.getSlug() == null) {
            challenge.setSlug(challenge.getTitle().toLowerCase().replaceAll("\\s+", "-"));
        }
        Challenge saved = challengeRepository.save(challenge);
        return ResponseEntity.ok(ApiResponse.ok("Challenge created", saved));
    }

    @PutMapping("/challenges/{id}")
    public ResponseEntity<ApiResponse<Challenge>> updateChallenge(
            @PathVariable String id, @RequestBody Challenge challenge) {
        if (!challengeRepository.existsById(id)) {
            throw new IllegalArgumentException("Challenge not found: " + id);
        }
        challenge.setId(id);
        Challenge saved = challengeRepository.save(challenge);
        return ResponseEntity.ok(ApiResponse.ok("Challenge updated", saved));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getUsers() {
        List<User> users = userRepository.findAll();
        // Strip sensitive fields - done via JSON view or projection in production
        return ResponseEntity.ok(ApiResponse.ok(users));
    }
}
