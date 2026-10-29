package com.coderoyale.ai;

import com.coderoyale.common.ApiResponse;
import com.coderoyale.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Map<String, String>>> chat(
            @Valid @RequestBody AiChatRequest req,
            @AuthenticationPrincipal User user) {
        Map<String, String> response = aiService.queryCoach(user.getId(), req);
        return ResponseEntity.ok(ApiResponse.ok("CYBER-SAGE response transmitted", response));
    }
}
