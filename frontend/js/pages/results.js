/**
 * CodeRoyale — Match Results & Rewards Controller
 * Polished victory/defeat screen, MMR deltas, XP unlocks, and solution review.
 */

import { sound } from '../sound.js';
import { router } from '../router.js';
import { store } from '../state.js';

export const ResultsPage = {
  onEnter() {
    this.outcome = store.get('lastMatchOutcome') || {
      isVictory: true,
      reason: 'OPPONENT NEXUS ANNIHILATED',
      challenge: { title: 'Two Sum Nexus', difficulty: 'Easy' },
      opponent: { username: 'QuantumGhost', avatar: '⚡' },
      duration: '01:42',
      xpEarned: 250,
      mmrDelta: 28,
      testsPassed: 5,
      totalTests: 5
    };

    if (this.outcome.isVictory) {
      sound.playVictory();
    } else {
      sound.playDefeat();
    }

    this.render();
    this.bindEvents();
  },

  render() {
    const user = store.get('user');
    const outcome = this.outcome;
    const isVic = outcome.isVictory;
    const container = document.getElementById('results-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="max-width: 760px; padding: 3rem 1.5rem 5rem;">
        <div class="holo-panel hud-corner" style="text-align: center; border-color: ${isVic ? 'var(--neon-emerald)' : 'var(--neon-magenta)'}; box-shadow: 0 0 40px ${isVic ? 'rgba(0,245,155,0.2)' : 'rgba(255,0,127,0.2)'};">
          <!-- Victory / Defeat Header -->
          <div style="font-size: 4rem; margin-bottom: 0.5rem; animation: floatAnim 3s infinite;">
            ${isVic ? '🏆' : '💀'}
          </div>

          <h1 style="font-size: 2.8rem; letter-spacing: 0.1em; color: ${isVic ? 'var(--neon-emerald)' : 'var(--neon-magenta)'}; margin-bottom: 0.25rem;">
            ${isVic ? 'COMBAT VICTORY' : 'NEXUS BREACHED'}
          </h1>

          <div style="font-family: var(--font-heading); font-size: 0.95rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 2rem;">
            ${outcome.reason}
          </div>

          <!-- Reward & Rating Delta Matrix -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="combat-stat-box" style="border-color: ${isVic ? 'var(--neon-emerald)' : 'var(--neon-magenta)'};">
              <div class="combat-stat-val" style="color: ${isVic ? 'var(--neon-emerald)' : 'var(--neon-red)'};">
                ${outcome.mmrDelta > 0 ? `+${outcome.mmrDelta}` : outcome.mmrDelta} MMR
              </div>
              <div class="combat-stat-lbl">Rating Delta</div>
            </div>

            <div class="combat-stat-box">
              <div class="combat-stat-val text-gold">+${outcome.xpEarned} XP</div>
              <div class="combat-stat-lbl">Experience Earned</div>
            </div>

            <div class="combat-stat-box">
              <div class="combat-stat-val text-cyan">${outcome.testsPassed}/${outcome.totalTests}</div>
              <div class="combat-stat-lbl">Test Suites Passed</div>
            </div>

            <div class="combat-stat-box">
              <div class="combat-stat-val">${outcome.duration}</div>
              <div class="combat-stat-lbl">Match Duration</div>
            </div>
          </div>

          <!-- Match Specifications Summary -->
          <div class="cyber-card" style="text-align: left; margin-bottom: 2rem; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-family: var(--font-heading); font-weight: 700; text-transform: uppercase;">Challenge Completed</span>
              <span class="badge badge-cyan">${outcome.challenge.title}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="color: var(--text-secondary); font-size: 0.85rem;">Opponent Gladiator</span>
              <span style="font-weight: 700;">${outcome.opponent.avatar} ${outcome.opponent.username}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: var(--text-secondary); font-size: 0.85rem;">Gladiator Current Tier</span>
              <span class="text-gold font-bold">${user.rank} (${user.mmr} pts)</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button id="results-rematch-btn" class="btn btn-cyber">
              <span>⚔️</span> QUEUE AGAIN
            </button>
            <button id="results-quest-btn" class="btn btn-emerald">
              <span>🗺️</span> NEXT QUEST
            </button>
            <button id="results-dashboard-btn" class="btn btn-ghost">
              RETURN TO LOBBY
            </button>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('results-rematch-btn')?.addEventListener('click', () => {
      router.navigate('matchmaking');
    });
    document.getElementById('results-quest-btn')?.addEventListener('click', () => {
      router.navigate('quest');
    });
    document.getElementById('results-dashboard-btn')?.addEventListener('click', () => {
      router.navigate('dashboard');
    });
  }
};
