/**
 * CodeRoyale — Gaming Dashboard Controller
 */

import { RankBadge } from '../components/rankBadge.js';
import { router } from '../router.js';
import { store } from '../state.js';

export const DashboardPage = {
  onEnter() {
    this.render();
    this.bindEvents();
  },

  render() {
    const user = store.get('user');
    const rankObj = RankBadge.getRankData(user.rank);
    const dailyQuests = store.get('dailyQuests');
    const container = document.getElementById('dashboard-page');
    if (!container) return;

    const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));

    container.innerHTML = `
      <div class="container" style="padding: 2rem 1.5rem 4rem;">
        <!-- Quick Play Esports Banner -->
        <div class="quick-play-banner hud-corner">
          <div class="quick-play-info">
            <div class="badge badge-magenta" style="margin-bottom: 0.5rem;">🔥 SEASON 4 IS HEATING UP</div>
            <h2>RANKED 1v1 CODE DUEL</h2>
            <p>Battle gladiators in real-time. Win to earn +28 MMR and ascend the global ladder.</p>
          </div>
          <button id="dash-quick-battle-btn" class="btn btn-cyber btn-lg">
            <span>⚔️</span> FIND MATCH
          </button>
        </div>

        <div class="dashboard-grid">
          <!-- Left: Player Profile & Rank Progression Card -->
          <div class="player-hero-card">
            <div class="avatar-frame xl ${user.rankId}">
              <div class="avatar-icon">${user.avatar}</div>
            </div>

            <div class="rank-emblem-display">
              ${rankObj.emblem}
            </div>

            <h3 class="player-callsign">${user.username}</h3>
            <div class="player-title">${user.avatarClass} • ${rankObj.name} Tier</div>

            <div style="width: 100%; margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.35rem; font-family: var(--font-heading); text-transform: uppercase;">
                <span>Skill Rating (MMR)</span>
                <span class="text-cyan font-bold">${user.mmr} pts</span>
              </div>
              <div class="progress-container">
                <div class="progress-bar" style="width: ${Math.min(100, (user.mmr % 400) / 4)}%;"></div>
              </div>
            </div>

            <div style="width: 100%; margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.35rem; font-family: var(--font-heading); text-transform: uppercase;">
                <span>Level ${user.level} XP Progress</span>
                <span class="text-gold font-bold">${user.xp} / ${user.xpToNextLevel} XP</span>
              </div>
              <div class="progress-container">
                <div class="progress-bar gold" style="width: ${xpPercent}%;"></div>
              </div>
            </div>

            <div class="combat-stats-grid">
              <div class="combat-stat-box">
                <div class="combat-stat-val text-emerald">${user.wins}</div>
                <div class="combat-stat-lbl">Victories</div>
              </div>
              <div class="combat-stat-box">
                <div class="combat-stat-val text-magenta">${user.losses}</div>
                <div class="combat-stat-lbl">Defeats</div>
              </div>
              <div class="combat-stat-box">
                <div class="combat-stat-val text-cyan">${user.winRate}%</div>
                <div class="combat-stat-lbl">Win Rate</div>
              </div>
              <div class="combat-stat-box">
                <div class="combat-stat-val text-gold">${user.streak}🔥</div>
                <div class="combat-stat-lbl">Win Streak</div>
              </div>
            </div>

            <div style="width: 100%; display: flex; gap: 0.5rem;">
              <button id="dash-view-profile-btn" class="btn btn-ghost btn-sm" style="flex: 1;">Profile</button>
              <button id="dash-settings-btn" class="btn btn-ghost btn-sm" style="flex: 1;">Settings</button>
            </div>
          </div>

          <!-- Right Column: Quests & Recent Match Logs -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Daily Quests Hub -->
            <div class="cyber-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="font-size: 1.15rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                  <span>🎯</span> DAILY CODING BOUNTIES
                </h3>
                <a href="#quest" style="color: var(--neon-cyan); font-size: 0.85rem; text-decoration: none; font-family: var(--font-heading); font-weight: 700;">
                  OPEN QUEST MAP &rarr;
                </a>
              </div>

              <div class="daily-quests-grid" style="margin-top: 0;">
                ${dailyQuests.map(dq => `
                  <div class="daily-quest-card" style="padding: 1rem;">
                    <div class="daily-quest-header">
                      <div style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem;">${dq.title}</div>
                      <span class="badge ${dq.completed ? 'badge-emerald' : 'badge-gold'}">${dq.completed ? 'CLAIMED' : 'ACTIVE'}</span>
                    </div>
                    <div class="progress-container" style="height: 8px;">
                      <div class="progress-bar ${dq.completed ? 'emerald' : ''}" style="width: ${Math.round((dq.progress / dq.total) * 100)}%;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
                      <span>Progress: ${dq.progress}/${dq.total}</span>
                      <span class="daily-quest-reward">+${dq.rewardXp} XP</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Recent Match Logs -->
            <div class="recent-matches-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.15rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                  <span>📜</span> RECENT MATCH TELEMETRY
                </h3>
                <span class="badge badge-cyan">AUTHORITATIVE LOGS</span>
              </div>

              <div class="match-history-list">
                <div class="match-history-row victory">
                  <div style="font-size: 1.5rem;">🏆</div>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem;">Two Sum Nexus</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">vs QuantumGhost (1565 MMR)</div>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--neon-cyan); font-family: var(--font-mono);">01:42 (100% Passed)</div>
                  <div class="match-result-badge">VICTORY</div>
                  <div style="font-family: var(--font-display); font-weight: 700; color: var(--neon-emerald); text-align: right;">+28 MMR</div>
                </div>

                <div class="match-history-row defeat">
                  <div style="font-size: 1.5rem;">💀</div>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem;">Valid Syntax Shield</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">vs ApexGlitch (1590 MMR)</div>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--neon-magenta); font-family: var(--font-mono);">03:10 (80% Passed)</div>
                  <div class="match-result-badge">DEFEAT</div>
                  <div style="font-family: var(--font-display); font-weight: 700; color: var(--neon-red); text-align: right;">-18 MMR</div>
                </div>

                <div class="match-history-row victory">
                  <div style="font-size: 1.5rem;">🏆</div>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem;">Longest Cyber Streak</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">vs PixelKnight (1540 MMR)</div>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--neon-cyan); font-family: var(--font-mono);">02:18 (100% Passed)</div>
                  <div class="match-result-badge">VICTORY</div>
                  <div style="font-family: var(--font-display); font-weight: 700; color: var(--neon-emerald); text-align: right;">+30 MMR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('dash-quick-battle-btn')?.addEventListener('click', () => {
      router.navigate('matchmaking');
    });
    document.getElementById('dash-view-profile-btn')?.addEventListener('click', () => {
      router.navigate('profile');
    });
    document.getElementById('dash-settings-btn')?.addEventListener('click', () => {
      router.navigate('settings');
    });
  }
};
