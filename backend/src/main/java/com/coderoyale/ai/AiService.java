package com.coderoyale.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AiService {

    @Value("${coderoyale.ai.api-url:}")
    private String apiUrl;

    @Value("${coderoyale.ai.api-key:}")
    private String apiKey;

    @Value("${coderoyale.ai.model:gpt-4o-mini}")
    private String model;

    @Value("${coderoyale.ai.rate-limit-per-min:15}")
    private int rateLimitPerMin;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ConcurrentHashMap<String, AtomicInteger> rateLimitMap = new ConcurrentHashMap<>();

    public Map<String, String> queryCoach(String userId, AiChatRequest req) {
        // Rate limiting per user per minute
        String key = userId + ":" + LocalTime.now().getMinute();
        AtomicInteger count = rateLimitMap.computeIfAbsent(key, k -> new AtomicInteger(0));
        if (count.incrementAndGet() > rateLimitPerMin) {
            throw new IllegalArgumentException("AI rate limit exceeded. Please wait before querying CYBER-SAGE again.");
        }

        String response;
        if (apiUrl != null && !apiUrl.isBlank() && apiKey != null && !apiKey.isBlank()) {
            response = callLlmApi(req);
        } else {
            response = generateFallbackResponse(req.getPrompt(), req.getChallengeContext());
        }

        return Map.of("response", response, "timestamp", LocalTime.now().toString());
    }

    private String callLlmApi(AiChatRequest req) {
        try {
            String systemPrompt = """
                You are CYBER-SAGE, an elite AI coding coach embedded in CodeRoyale — a competitive esports coding battle arena.
                Your role: help gladiators understand algorithms, debug code, analyze complexity, and provide progressive hints.
                Communication style: technical but engaging, use gaming metaphors where natural.
                NEVER give away complete solutions — guide with strategic hints.
                Context: %s
                """.formatted(req.getChallengeContext() != null ? req.getChallengeContext() : "General practice arena");

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("model", model);
            payload.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", req.getPrompt())
            ));
            payload.put("max_tokens", 512);
            payload.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl, new HttpEntity<>(payload, headers), Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List choices = (List) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map choice = (Map) choices.get(0);
                    Map message = (Map) choice.get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            // Fall through to fallback
        }
        return generateFallbackResponse(req.getPrompt(), req.getChallengeContext());
    }

    private String generateFallbackResponse(String prompt, String context) {
        String p = prompt != null ? prompt.toLowerCase() : "";

        if (p.contains("hint") || p.contains("clue") || p.contains("stuck")) {
            return """
                **[CYBER-SAGE TACTICAL HINT]**
                
                Consider using a **HashMap** to trade space for time.
                For each element `x`, calculate the complement `target - x` and check if it already exists in your map.
                
                This transforms the naive O(N²) brute-force into an elegant **O(N) linear pass**.
                Single-pass hash map is the key to this quantum lock!
                """;
        }
        if (p.contains("complexity") || p.contains("big-o") || p.contains("time")) {
            return """
                **[COMPLEXITY DIAGNOSTICS]**
                
                - **Optimal Time Complexity:** `O(N)` — single hash table pass
                - **Optimal Space Complexity:** `O(N)` — hash map storage
                - **Brute Force Warning:** Two nested loops = `O(N²)` → triggers **Time Limit Exceeded** in Ranked Arena!
                
                Always analyze constraints first: `N ≤ 10^4` demands at least O(N log N) or better.
                """;
        }
        if (p.contains("explain") || p.contains("problem") || p.contains("understand")) {
            return """
                **[PROBLEM DECONSTRUCTION]**
                
                Core objective: find two indices where `nums[i] + nums[j] == target`.
                
                Key constraints to internalize:
                1. Exactly **one** valid solution exists
                2. Cannot use the **same element twice** (i ≠ j)
                3. Return **indices**, not values
                
                Think about what data structure lets you look up "have I seen the complement yet?" in O(1) time.
                """;
        }
        return """
            **[CYBER-SAGE TACTICAL ADVICE]**
            
            Solid question, Gladiator. Start by identifying the bottleneck in your current approach.
            
            Key questions to ask yourself:
            - What are the time/space complexity requirements given the constraints?
            - Is there a data structure that would make a key operation faster?
            - Can you solve this in a single pass rather than multiple iterations?
            
            Remember: elegant solutions often emerge when you think about what information you need to *remember* as you traverse.
            """;
    }
}
