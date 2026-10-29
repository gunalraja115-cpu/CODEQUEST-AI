/**
 * CodeRoyale — Player Profile & Badges Showcase Controller
 */

import { store } from '../state.js';
import { RankBadge } from '../components/rankBadge.js';

export const ProfilePage = {
  onEnter() {
    this.render();
  },

  render() {
    const user = store.get('user');
    const rankObj = RankBadge.getRankData(user.rank);
    const container = document.getElementById('profile-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="max-width: 980px; padding: 2.5rem 1.5rem 5rem;">
        <!-- Profile Banner -->
        <div class="holo-panel hud-corner" style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
            <div class="avatar-frame xl ${user.rankId}">
              <div class="avatar-icon">${user.avatar}</div>
            </div>

            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
                <h1 style="font-size: 2rem;">${user.username}</h1>
                ${RankBadge.renderBadge(user.rank)}
              </div>
              <div style="color: var(--neon-cyan); font-family: var(--font-heading); font-size: 0.95rem; text-transform: uppercase; margin-bottom: 0.75rem;">
                Class: ${user.avatarClass} • Level ${user.level} Gladiator
              </div>
              <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 600px;">
                ${user.bio || 'Climbing the cyber ranks. Master of clean hash maps and sliding windows.'}
              </p>
            </div>

            <div style="text-align: right;">
              <div style="font-family: var(--font-heading); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Skill Rating (MMR)</div>
              <div style="font-family: var(--font-display); font-size: 2.2rem; color: var(--neon-cyan); font-weight: 700;">
                ${user.mmr}
              </div>
            </div>
          </div>
        </div>

        <!-- Career Combat Records -->
        <div class="combat-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 2rem;">
          <div class="cyber-card">
            <div class="combat-stat-val text-emerald">${user.wins}</div>
            <div class="combat-stat-lbl">Career Victories</div>
          </div>
          <div class="cyber-card">
            <div class="combat-stat-val text-magenta">${user.losses}</div>
            <div class="combat-stat-lbl">Career Defeats</div>
          </div>
          <div class="cyber-card">
            <div class="combat-stat-val text-cyan">${user.winRate}%</div>
            <div class="combat-stat-lbl">Win Ratio</div>
          </div>
          <div class="cyber-card">
            <div class="combat-stat-val text-gold">${user.streak} Matches</div>
            <div class="combat-stat-lbl">Best Streak</div>
          </div>
        </div>

        <!-- Unlocked Achievement Badges -->
        <div class="cyber-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.25rem; color: var(--neon-cyan); display: flex; align-items: center; gap: 0.5rem;">
              <span>🏅</span> UNLOCKED ACHIEVEMENTS & MEDALS
            </h3>
            <span class="badge badge-gold">${user.badges.length} / 12 UNLOCKED</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            ${user.badges.map(b => `
              <div style="background: rgba(10,14,26,0.7); border: 1px solid rgba(0,240,255,0.2); border-radius: var(--border-radius-sm); padding: 1rem; display: flex; align-items: center; gap: 0.75rem;">
                <div style="font-size: 2rem;">✨</div>
                <div>
                  <div style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${b}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary);">Verified on blockchain matrix</div>
                </div>
              </div>
            `).join('')}

            <div style="background: rgba(10,14,26,0.3); border: 1px dashed rgba(148,163,184,0.2); border-radius: var(--border-radius-sm); padding: 1rem; display: flex; align-items: center; gap: 0.75rem; opacity: 0.6;">
              <div style="font-size: 2rem;">🔒</div>
              <div>
                <div style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem;">Titan Conqueror</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Defeat all 5 bosses to unlock</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
