package com.coderoyale.submission;

import jakarta.validation.constraints.NotBlank;

public class SubmissionRequest {
    @NotBlank(message = "Challenge ID required")
    private String challengeId;

    @NotBlank(message = "Programming language required")
    private String language;

    @NotBlank(message = "Code solution required")
    private String code;

    private String matchId;
    private String customInput;

    public String getChallengeId() { return challengeId; }
    public void setChallengeId(String challengeId) { this.challengeId = challengeId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMatchId() { return matchId; }
    public void setMatchId(String matchId) { this.matchId = matchId; }

    public String getCustomInput() { return customInput; }
    public void setCustomInput(String customInput) { this.customInput = customInput; }
}
