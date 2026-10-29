package com.coderoyale.rank;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRatingRepository extends JpaRepository<UserRating, String> {
    Optional<UserRating> findByUserId(String userId);
    Page<UserRating> findAllByOrderByMmrDesc(Pageable pageable);
}
