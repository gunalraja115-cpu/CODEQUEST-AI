package com.coderoyale.submission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByUserIdOrderBySubmittedAtDesc(String userId);
    List<Submission> findByMatchIdAndUserId(String matchId, String userId);
    boolean existsByMatchIdAndUserId(String matchId, String userId);
}
