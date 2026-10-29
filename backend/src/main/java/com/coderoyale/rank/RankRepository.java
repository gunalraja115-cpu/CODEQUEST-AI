package com.coderoyale.rank;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RankRepository extends JpaRepository<Rank, String> {
    Optional<Rank> findByNameIgnoreCase(String name);
    Optional<Rank> findTopByMinMmrLessThanEqualOrderByMinMmrDesc(Integer mmr);
}
