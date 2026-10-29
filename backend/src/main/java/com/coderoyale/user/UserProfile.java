package com.coderoyale.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @Column(name = "user_id", length = 36)
    private String userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 50)
    private String callsign;

    @Column(name = "avatar_class", length = 50)
    private String avatarClass;

    @Column(name = "avatar_icon", length = 10)
    private String avatarIcon;

    @Column(name = "skill_level", length = 20)
    private String skillLevel;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private Integer coins;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public UserProfile() {
        this.createdAt = LocalDateTime.now();
        this.coins = 500;
        this.avatarClass = "Cyber Shinobi";
        this.avatarIcon = "🥷";
        this.skillLevel = "Intermediate";
    }

    public UserProfile(User user, String callsign, String avatarClass, String avatarIcon) {
        this.user = user;
        this.userId = user.getId();
        this.callsign = callsign;
        this.avatarClass = avatarClass != null ? avatarClass : "Cyber Shinobi";
        this.avatarIcon = avatarIcon != null ? avatarIcon : "🥷";
        this.skillLevel = "Intermediate";
        this.coins = 500;
        this.createdAt = LocalDateTime.now();
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCallsign() { return callsign; }
    public void setCallsign(String callsign) { this.callsign = callsign; }

    public String getAvatarClass() { return avatarClass; }
    public void setAvatarClass(String avatarClass) { this.avatarClass = avatarClass; }

    public String getAvatarIcon() { return avatarIcon; }
    public void setAvatarIcon(String avatarIcon) { this.avatarIcon = avatarIcon; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
