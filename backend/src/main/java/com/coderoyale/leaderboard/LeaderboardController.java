package com.coderoyale.leaderboard;

import com.coderoyale.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaderboardEntryDto>>> getLeaderboard(
            @RequestParam(defaultValue = "global") String type,
            @RequestParam(defaultValue = "all") String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<LeaderboardEntryDto> entries = leaderboardService.getGlobalLeaderboard(page, Math.min(size, 100));
        return ResponseEntity.ok(ApiResponse.ok(entries));
    }
}
