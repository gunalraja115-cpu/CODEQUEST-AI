package com.coderoyale.challenge;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, String> {
    List<TestCase> findByChallengeIdOrderByOrderIndexAsc(String challengeId);
    List<TestCase> findByChallengeIdAndIsHiddenFalseOrderByOrderIndexAsc(String challengeId);
}
