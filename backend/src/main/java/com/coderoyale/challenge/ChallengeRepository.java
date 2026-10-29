package com.coderoyale.challenge;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, String> {
    Optional<Challenge> findBySlug(String slug);
    List<Challenge> findByDifficulty(String difficulty);
    List<Challenge> findByCategory(String category);
}
