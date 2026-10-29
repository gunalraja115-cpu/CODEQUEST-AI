package com.coderoyale.rank;

import com.coderoyale.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "user_ratings")
public class UserRating {

    @Id
    @Column(name = "user_id", length = 36)
    private String userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Integer mmr;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_rank_id")
    private Rank currentRank;

    @Column(name = "peak_mmr", nullable = false)
    private Integer peakMmr;

    private Integer wins;
    private Integer losses;
    private Integer draws;

    @Column(name = "current_streak")
    private Integer currentStreak;

    @Column(name = "best_streak")
    private Integer bestStreak;

    private Integer xp;

    @Column(name = "player_level")
    private Integer playerLevel;

    public UserRating() {
        this.mmr = 1200;
        this.peakMmr = 1200;
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.xp = 0;
        this.playerLevel = 1;
    }

    public UserRating(User user, Rank defaultRank) {
        this.user = user;
        this.userId = user.getId();
        this.currentRank = defaultRank;
        this.mmr = 1200;
        this.peakMmr = 1200;
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.xp = 0;
        this.playerLevel = 1;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getMmr() { return mmr; }
    public void setMmr(Integer mmr) { this.mmr = mmr; }

    public Rank getCurrentRank() { return currentRank; }
    public void setCurrentRank(Rank currentRank) { this.currentRank = currentRank; }

    public Integer getPeakMmr() { return peakMmr; }
    public void setPeakMmr(Integer peakMmr) { this.peakMmr = peakMmr; }

    public Integer getWins() { return wins; }
    public void setWins(Integer wins) { this.wins = wins; }

    public Integer getLosses() { return losses; }
    public void setLosses(Integer losses) { this.losses = losses; }

    public Integer getDraws() { return draws; }
    public void setDraws(Integer draws) { this.draws = draws; }

    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public Integer getBestStreak() { return bestStreak; }
    public void setBestStreak(Integer bestStreak) { this.bestStreak = bestStreak; }

    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }

    public Integer getPlayerLevel() { return playerLevel; }
    public void setPlayerLevel(Integer playerLevel) { this.playerLevel = playerLevel; }
}
