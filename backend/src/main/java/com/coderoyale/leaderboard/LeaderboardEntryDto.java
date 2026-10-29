package com.coderoyale.leaderboard;

public class LeaderboardEntryDto {
    private String userId;
    private String username;
    private String avatarIcon;
    private String avatarClass;
    private int mmr;
    private String rankName;
    private int wins;
    private int losses;
    private int winRate;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatarIcon() { return avatarIcon; }
    public void setAvatarIcon(String avatarIcon) { this.avatarIcon = avatarIcon; }

    public String getAvatarClass() { return avatarClass; }
    public void setAvatarClass(String avatarClass) { this.avatarClass = avatarClass; }

    public int getMmr() { return mmr; }
    public void setMmr(int mmr) { this.mmr = mmr; }

    public String getRankName() { return rankName; }
    public void setRankName(String rankName) { this.rankName = rankName; }

    public int getWins() { return wins; }
    public void setWins(int wins) { this.wins = wins; }

    public int getLosses() { return losses; }
    public void setLosses(int losses) { this.losses = losses; }

    public int getWinRate() { return winRate; }
    public void setWinRate(int winRate) { this.winRate = winRate; }
}
