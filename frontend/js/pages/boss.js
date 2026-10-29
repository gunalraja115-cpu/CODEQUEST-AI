/**
 * CodeRoyale — Boss Battle Arena Controller
 * Multi-stage algorithmic boss raids with dynamic health bars and legendary rewards.
 */

import { BOSSES, CHALLENGES } from '../mockData.js';
import { sound } from '../sound.js';
import { Toast } from '../components/toast.js';
import { router } from '../router.js';
import { store } from '../state.js';

export const BossPage = {
  onEnter() {
    this.bosses = store.get('bossCatalog') || [...BOSSES];
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('boss-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="padding: 2.5rem 1.5rem 5rem;">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div class="badge badge-magenta" style="margin-bottom: 0.75rem;">LEGENDARY ALGORITHMIC PVE RAIDS</div>
          <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">TITAN BOSS ARENAS</h1>
          <p style="color: var(--text-secondary); max-width: 650px; margin: 0 auto;">
            Defeat corrupt cyber entities in multi-phase algorithmic combat. Pass edge cases to break through their defensive shields and claim rare titles.
          </p>
        </div>

        <div class="boss-grid">
          ${this.bosses.map(boss => `
            <div class="boss-card ${boss.classKey}">
              <div>
                <div class="boss-header">
                  <div class="boss-avatar-wrapper">
                    <span>${boss.avatar}</span>
                  </div>
                  <div class="boss-details">
                    <h3 class="boss-name">${boss.name}</h3>
                    <div class="boss-title">${boss.title}</div>
                    <span class="badge ${boss.difficulty === 'Champion' ? 'badge-gold' : (boss.difficulty === 'Grandmaster' ? 'badge-magenta' : 'badge-cyan')}" style="margin-top: 0.25rem;">
                      ${boss.difficulty}
                    </span>
                  </div>
                </div>

                <div class="boss-quote-box" style="margin-bottom: 1rem;">
                  ${boss.quote}
                </div>

                <p class="boss-description">${boss.description}</p>

                <!-- Boss HP Bar -->
                <div class="boss-hp-section">
                  <div class="boss-hp-labels">
                    <span>Boss HP Core</span>
                    <span class="text-magenta font-bold">${boss.currentHp} / ${boss.totalHp} HP</span>
                  </div>
                  <div class="boss-hp-bar">
                    <div class="boss-hp-fill" style="width: ${Math.round((boss.currentHp / boss.totalHp) * 100)}%;"></div>
                  </div>
                </div>
              </div>

              <div>
                <div class="boss-footer">
                  <div class="boss-rewards">
                    <span class="reward-item">⚡ +${boss.rewardXp} XP</span>
                    <span class="reward-item">🏅 ${boss.rewardBadge}</span>
                  </div>
                  <button class="btn btn-danger btn-sm launch-boss-btn" data-boss-id="${boss.id}">
                    <span>⚔️</span> ENGAGE RAID
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.querySelectorAll('.launch-boss-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playMatchFound();
        const bossId = btn.getAttribute('data-boss-id');
        const boss = this.bosses.find(b => b.id === bossId) || this.bosses[0];

        // Find associated challenge
        const challenge = CHALLENGES.find(c => c.id === boss.challengeId) || CHALLENGES[0];
        store.set('currentChallenge', challenge);

        store.set('activeMatch', {
          matchId: 'boss-' + boss.id,
          mode: 'boss_raid',
          opponent: {
            username: boss.name,
            avatar: boss.avatar,
            rank: boss.difficulty,
            mmr: 2800
          },
          durationSec: 420
        });

        Toast.warning('Raid Engaged', `Entering combat with ${boss.name}!`);
        router.navigate('arena?mode=boss');
      });
    });
  }
};
