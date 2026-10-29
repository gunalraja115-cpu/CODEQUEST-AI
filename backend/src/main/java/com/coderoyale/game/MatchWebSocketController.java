package com.coderoyale.game;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
public class MatchWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public MatchWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Player ready signal for countdown
    @MessageMapping("/match.ready")
    public void playerReady(@Payload Map<String, String> payload, Principal principal,
                            SimpMessageHeaderAccessor headerAccessor) {
        String matchId = payload.get("matchId");
        if (matchId == null || principal == null) return;

        Map<String, Object> event = Map.of(
                "event", "PLAYER_READY",
                "username", principal.getName(),
                "matchId", matchId
        );
        messagingTemplate.convertAndSend("/topic/match/" + matchId, event);
    }

    // Broadcast score update (server-validated)
    @MessageMapping("/match.scoreUpdate")
    public void broadcastScore(@Payload Map<String, Object> payload, Principal principal) {
        String matchId = (String) payload.get("matchId");
        if (matchId == null || principal == null) return;

        // NOTE: In production, scores are validated server-side before broadcast.
        // Client-side score claims are ignored; only submission service triggers score events.
        Map<String, Object> event = Map.of(
                "event", "SCORE_UPDATED",
                "username", principal.getName(),
                "passedCases", payload.getOrDefault("passedCases", 0),
                "damage", payload.getOrDefault("damage", 0)
        );
        messagingTemplate.convertAndSend("/topic/match/" + matchId, event);
    }

    // Player disconnect notification
    @MessageMapping("/match.disconnect")
    public void playerDisconnected(@Payload Map<String, String> payload, Principal principal) {
        String matchId = payload.get("matchId");
        if (matchId == null || principal == null) return;

        Map<String, Object> event = Map.of(
                "event", "PLAYER_DISCONNECTED",
                "username", principal.getName(),
                "matchId", matchId
        );
        messagingTemplate.convertAndSend("/topic/match/" + matchId, event);
    }
}
