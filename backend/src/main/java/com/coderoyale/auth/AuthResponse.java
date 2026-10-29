package com.coderoyale.auth;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String userId;
    private String username;
    private String role;
    private Integer mmr;
    private String rank;

    public AuthResponse(String token, String userId, String username, String role, Integer mmr, String rank) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.mmr = mmr;
        this.rank = rank;
    }

    public String getToken() { return token; }
    public String getType() { return type; }
    public String getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public Integer getMmr() { return mmr; }
    public String getRank() { return rank; }
}
