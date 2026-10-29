package com.coderoyale.rank;

import jakarta.persistence.*;

@Entity
@Table(name = "ranks")
public class Rank {

    @Id
    @Column(length = 20)
    private String id; // bronze, silver, gold, platinum, diamond, master, grandmaster, champion

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "tier_order", nullable = false, unique = true)
    private Integer tierOrder;

    @Column(name = "min_mmr", nullable = false)
    private Integer minMmr;

    @Column(name = "max_mmr", nullable = false)
    private Integer maxMmr;

    @Column(name = "emblem_icon", nullable = false, length = 10)
    private String emblemIcon;

    @Column(name = "accent_color", nullable = false, length = 10)
    private String accentColor;

    public Rank() {}

    public Rank(String id, String name, Integer tierOrder, Integer minMmr, Integer maxMmr, String emblemIcon, String accentColor) {
        this.id = id;
        this.name = name;
        this.tierOrder = tierOrder;
        this.minMmr = minMmr;
        this.maxMmr = maxMmr;
        this.emblemIcon = emblemIcon;
        this.accentColor = accentColor;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getTierOrder() { return tierOrder; }
    public void setTierOrder(Integer tierOrder) { this.tierOrder = tierOrder; }

    public Integer getMinMmr() { return minMmr; }
    public void setMinMmr(Integer minMmr) { this.minMmr = minMmr; }

    public Integer getMaxMmr() { return maxMmr; }
    public void setMaxMmr(Integer maxMmr) { this.maxMmr = maxMmr; }

    public String getEmblemIcon() { return emblemIcon; }
    public void setEmblemIcon(String emblemIcon) { this.emblemIcon = emblemIcon; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }
}
