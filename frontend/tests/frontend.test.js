/**
 * CodeRoyale — Frontend Logic Unit Tests
 * Validates MMR calculations, rank tier classification, and state transitions.
 */

import { RANKS } from '../js/mockData.js';
import { RankBadge } from '../js/components/rankBadge.js';
import { store } from '../js/state.js';

export function runFrontendTests() {
  console.log('--- [CodeRoyale] Running Frontend Logic Verification Suite ---');
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  // Test 1: Rank tier classification
  assert(RANKS.length === 8, 'Should have exactly 8 ranks: Bronze through Champion');
  assert(RankBadge.getRankData('bronze').id === 'bronze', 'Should retrieve Bronze rank correctly');
  assert(RankBadge.getRankData('Champion').minMmr === 3500, 'Champion tier should require 3500 MMR');

  // Test 2: MMR update logic
  const initialMmr = store.get('user').mmr;
  const newRank = store.updateMmr(50);
  assert(store.get('user').mmr === initialMmr + 50, 'MMR should increase by exactly 50 points');
  assert(store.get('user').wins > 0, 'Victories counter should increment on positive MMR delta');

  // Test 3: XP and level up threshold
  const initialLevel = store.get('user').level;
  store.addXP(10000);
  assert(store.get('user').level > initialLevel, 'Player level should advance after earning 10,000 XP');

  // Test 4: Quests structure
  const quests = store.get('questNodes');
  assert(quests.length === 11, 'Quest tree should contain all 11 milestone nodes from Java Foundations to Final Boss');

  console.log(`--- Test Results: ${passed} / ${total} tests passed successfully. ---`);
  return { passed, total };
}

// Auto-run if executed in browser test mode
if (typeof window !== 'undefined' && window.location.search.includes('runTests=true')) {
  window.addEventListener('load', () => runFrontendTests());
}
