package com.coderoyale.ai;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {

    @NotBlank(message = "Prompt cannot be blank")
    private String prompt;

    private String challengeContext;
    private String currentCode;

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getChallengeContext() { return challengeContext; }
    public void setChallengeContext(String challengeContext) { this.challengeContext = challengeContext; }

    public String getCurrentCode() { return currentCode; }
    public void setCurrentCode(String currentCode) { this.currentCode = currentCode; }
}
