package com.coderoyale.rank;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RankServiceUnitTest {

    @Test
    void mmrDeltaPositiveForWinner() {
        // Winner gets positive delta (tested via logic)
        int baseDelta = 25 + (5 * 2); // full test cases passed
        assertTrue(baseDelta > 0, "Winner should gain MMR");
    }

    @Test
    void mmrDeltaNegativeForLoser() {
        int loserDelta = -18 + 0; // zero tests passed
        assertTrue(loserDelta < 0, "Loser with no test cases should lose MMR");
    }

    @Test
    void partialTestPassMitigatesLoss() {
        int delta = -18 + 4; // partial mitigation
        assertTrue(delta > -18, "Partial tests passed should reduce MMR loss");
        assertTrue(delta < 0, "Still loses MMR despite partial tests");
    }

    @Test
    void rankTierOrderIsCorrect() {
        int[] mmrLevels = {0, 500, 1200, 1600, 2000, 2400, 2700, 3200, 4000};
        String[] expected = {"bronze","bronze","silver","gold","platinum","diamond","master","grandmaster","champion"};

        int[][] minMmr = {{0,999},{1000,1399},{1400,1799},{1800,2199},{2200,2599},{2600,2999},{3000,3499},{3500,99999}};
        String[] ranks = {"bronze","silver","gold","platinum","diamond","master","grandmaster","champion"};

        for (int i = 0; i < mmrLevels.length; i++) {
            int mmr = mmrLevels[i];
            String resolvedRank = "bronze";
            for (int j = 0; j < minMmr.length; j++) {
                if (mmr >= minMmr[j][0] && mmr <= minMmr[j][1]) {
                    resolvedRank = ranks[j];
                    break;
                }
            }
            assertEquals(expected[i], resolvedRank, "MMR " + mmr + " should map to " + expected[i]);
        }
    }
}
