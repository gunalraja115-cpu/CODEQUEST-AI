package com.coderoyale.rank;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RankService {

    private final UserRatingRepository userRatingRepository;
    private final RankRepository rankRepository;

    public RankService(UserRatingRepository userRatingRepository, RankRepository rankRepository) {
        this.userRatingRepository = userRatingRepository;
        this.rankRepository = rankRepository;
    }

    @Transactional
    public UserRating applyMatchOutcome(String userId, boolean isWinner, int testCasesPassed, int totalTestCases) {
        UserRating rating = userRatingRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User rating profile not found for ID: " + userId));

        int delta;
        if (isWinner) {
            delta = 25 + (testCasesPassed * 2);
            rating.setWins(rating.getWins() + 1);
            rating.setCurrentStreak(rating.getCurrentStreak() + 1);
            if (rating.getCurrentStreak() > rating.getBestStreak()) {
                rating.setBestStreak(rating.getCurrentStreak());
            }
        } else {
            delta = -18 + testCasesPassed; // partial mitigation for passing tests
            rating.setLosses(rating.getLosses() + 1);
            rating.setCurrentStreak(0);
        }

        int newMmr = Math.max(0, rating.getMmr() + delta);
        rating.setMmr(newMmr);

        if (newMmr > rating.getPeakMmr()) {
            rating.setPeakMmr(newMmr);
        }

        // Determine Rank based on MMR
        rankRepository.findTopByMinMmrLessThanEqualOrderByMinMmrDesc(newMmr)
                .ifPresent(rating::setCurrentRank);

        // Add XP
        int xpEarned = isWinner ? 250 : 50;
        rating.setXp(rating.getXp() + xpEarned);
        int neededXp = rating.getPlayerLevel() * 1000;
        if (rating.getXp() >= neededXp) {
            rating.setPlayerLevel(rating.getPlayerLevel() + 1);
        }

        return userRatingRepository.save(rating);
    }
}
