/**
 * CodeRoyale — Global & Friends Leaderboard Controller
 * Esports podium, tier emblems, language filters, and search.
 */

import { MOCK_LEADERBOARD } from '../mockData.js';
import { RankBadge } from '../components/rankBadge.js';
import { api } from '../api.js';

export const LeaderboardPage = {
  onEnter() {
    this.currentType = 'global';
    this.currentLang = 'all';
    this.searchQuery = '';
    this.leaderboardData = [...MOCK_LEADERBOARD];
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('leaderboard-page');
    if (!container) return;

    let filtered = this.leaderboardData.filter(item => {
      const matchSearch = item.username.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchLang = this.currentLang === 'all' || item.lang.toLowerCase() === this.currentLang.toLowerCase();
      return matchSearch && matchLang;
    });

    const top1 = filtered[0] || this.leaderboardData[0];
    const top2 = filtered[1] || this.leaderboardData[1];
    const top3 = filtered[2] || this.leaderboardData[2];

    container.innerHTML = `
      <div class="container leaderboard-container" style="padding: 2.5rem 1.5rem 5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="badge badge-gold" style="margin-bottom: 0.5rem;">GLOBAL ESPORTS CIRCUIT</div>
          <h1 style="font-size: 2.4rem; margin-bottom: 0.5rem;">HALL OF GLADIATORS</h1>
          <p style="color: var(--text-secondary);">Top ranked competitors of Season 4: Cybernetic Ascension</p>
        </div>

        <!-- Top 3 Esports Podium -->
        <div class="podium-section">
          <!-- 2nd Place -->
          <div class="podium-card second">
            <div class="podium-crown">🥈</div>
            <div class="avatar-frame lg" style="margin-top: 1rem;">
              <div class="avatar-icon">${top2.avatar}</div>
            </div>
            <div class="podium-rank-tag">#2</div>
            <div style="font-weight: 700; font-size: 1.1rem; margin-top: 0.25rem;">${top2.username}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${top2.title}</div>
            <div style="font-family: var(--font-display); font-size: 1.2rem; color: #c0c0c0; margin-top: 0.75rem;">
              ${top2.mmr} MMR
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${top2.winRate}% Win Rate (${top2.wins}W)</div>
          </div>

          <!-- 1st Place (Champion) -->
          <div class="podium-card first">
            <div class="podium-crown">👑</div>
            <div class="avatar-frame xl champion" style="margin-top: 1.25rem;">
              <div class="avatar-icon">${top1.avatar}</div>
            </div>
            <div class="podium-rank-tag">#1 CHAMPION</div>
            <div style="font-weight: 700; font-size: 1.3rem; margin-top: 0.25rem;">${top1.username}</div>
            <div style="font-size: 0.85rem; color: var(--neon-cyan);">${top1.title}</div>
            <div style="font-family: var(--font-display); font-size: 1.5rem; color: var(--neon-gold); margin-top: 0.75rem;">
              ${top1.mmr} MMR
            </div>
            <div style="font-size: 0.8rem; color: var(--neon-emerald); font-weight: 700;">
              ${top1.winRate}% Win Rate (${top1.wins}W - ${top1.losses}L)
            </div>
          </div>

          <!-- 3rd Place -->
          <div class="podium-card third">
            <div class="podium-crown">🥉</div>
            <div class="avatar-frame lg" style="margin-top: 1rem;">
              <div class="avatar-icon">${top3.avatar}</div>
            </div>
            <div class="podium-rank-tag">#3</div>
            <div style="font-weight: 700; font-size: 1.1rem; margin-top: 0.25rem;">${top3.username}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${top3.title}</div>
            <div style="font-family: var(--font-display); font-size: 1.2rem; color: #cd7f32; margin-top: 0.75rem;">
              ${top3.mmr} MMR
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${top3.winRate}% Win Rate (${top3.wins}W)</div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="leaderboard-filter-bar hud-corner">
          <div class="leaderboard-tabs">
            <button class="btn btn-sm ${this.currentType === 'global' ? 'btn-cyber' : 'btn-ghost'} lb-type-btn" data-type="global">Global</button>
            <button class="btn btn-sm ${this.currentType === 'friends' ? 'btn-cyber' : 'btn-ghost'} lb-type-btn" data-type="friends">Friends</button>
            <button class="btn btn-sm ${this.currentType === 'weekly' ? 'btn-cyber' : 'btn-ghost'} lb-type-btn" data-type="weekly">Weekly</button>
            <button class="btn btn-sm ${this.currentType === 'seasonal' ? 'btn-cyber' : 'btn-ghost'} lb-type-btn" data-type="seasonal">Seasonal</button>
          </div>

          <div class="filter-controls">
            <select id="lb-lang-filter" class="form-control" style="width: 130px; padding: 0.45rem 0.75rem; font-size: 0.85rem;">
              <option value="all" ${this.currentLang === 'all' ? 'selected' : ''}>All Languages</option>
              <option value="java" ${this.currentLang === 'java' ? 'selected' : ''}>Java</option>
              <option value="python" ${this.currentLang === 'python' ? 'selected' : ''}>Python</option>
              <option value="cpp" ${this.currentLang === 'cpp' ? 'selected' : ''}>C++</option>
            </select>

            <input type="text" id="lb-search-input" class="form-control" placeholder="Search Callsign..." value="${this.searchQuery}" style="width: 200px; padding: 0.45rem 0.75rem; font-size: 0.85rem;">
          </div>
        </div>

        <!-- Rankings Table -->
        <div class="leaderboard-table-card">
          <div class="table-responsive">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Gladiator Callsign</th>
                  <th>Tier & Emblem</th>
                  <th>Skill MMR</th>
                  <th>Win Rate</th>
                  <th>Primary Language</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(row => `
                  <tr>
                    <td>
                      <span class="table-rank-num">#${row.rank}</span>
                    </td>
                    <td>
                      <div class="player-cell">
                        <div class="avatar-frame sm">
                          <div class="avatar-icon">${row.avatar}</div>
                        </div>
                        <div>
                          <div style="font-weight: 700;">${row.username}</div>
                          <div style="font-size: 0.75rem; color: var(--text-secondary);">${row.title}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      ${RankBadge.renderBadge(row.rankTier)}
                    </td>
                    <td style="font-family: var(--font-display); font-weight: 700; color: var(--neon-cyan);">
                      ${row.mmr} pts
                    </td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-weight: 700;">${row.winRate}%</span>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">(${row.wins}W - ${row.losses}L)</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-cyan">${row.lang}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.querySelectorAll('.lb-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentType = btn.getAttribute('data-type');
        this.render();
        this.bindEvents();
      });
    });

    document.getElementById('lb-lang-filter')?.addEventListener('change', (e) => {
      this.currentLang = e.target.value;
      this.render();
      this.bindEvents();
    });

    document.getElementById('lb-search-input')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.render();
      this.bindEvents();
    });
  }
};
