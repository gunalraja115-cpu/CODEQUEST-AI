package com.coderoyale.challenge;

import com.coderoyale.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Challenge>>> getAllChallenges() {
        return ResponseEntity.ok(ApiResponse.ok(challengeService.getAllActiveChallenges()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Challenge>> getChallengeById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(challengeService.getChallengeById(id)));
    }
}
