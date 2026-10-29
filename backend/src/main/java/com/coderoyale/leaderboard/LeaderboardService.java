package com.coderoyale.leaderboard;

import com.coderoyale.rank.UserRating;
import com.coderoyale.rank.UserRatingRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final UserRatingRepository userRatingRepository;

    public LeaderboardService(UserRatingRepository userRatingRepository) {
        this.userRatingRepository = userRatingRepository;
    }

    public List<LeaderboardEntryDto> getGlobalLeaderboard(int page, int size) {
        return userRatingRepository
                .findAllByOrderByMmrDesc(PageRequest.of(page, size))
                .getContent()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private LeaderboardEntryDto toDto(UserRating rating) {
        LeaderboardEntryDto dto = new LeaderboardEntryDto();
        dto.setUserId(rating.getUserId());
        dto.setUsername(rating.getUser().getUsername());
        dto.setMmr(rating.getMmr());
        dto.setWins(rating.getWins());
        dto.setLosses(rating.getLosses());
        dto.setRankName(rating.getCurrentRank() != null ? rating.getCurrentRank().getName() : "Unranked");
        dto.setWinRate(calculateWinRate(rating.getWins(), rating.getLosses()));
        if (rating.getUser().getProfile() != null) {
            dto.setAvatarIcon(rating.getUser().getProfile().getAvatarIcon());
            dto.setAvatarClass(rating.getUser().getProfile().getAvatarClass());
        }
        return dto;
    }

    private int calculateWinRate(int wins, int losses) {
        int total = wins + losses;
        return total > 0 ? (int) ((double) wins / total * 100) : 0;
    }
}
