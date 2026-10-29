/**
 * CodeRoyale — Admin Management Dashboard Controller
 * Authorized operations: Challenge CRUD, test case builder, server sandbox metrics.
 */

import { CHALLENGES } from '../mockData.js';
import { Toast } from '../components/toast.js';
import { store } from '../state.js';

export const AdminPage = {
  onEnter() {
    this.challenges = [...CHALLENGES];
    this.render();
    this.bindEvents();
  },

  render() {
    const user = store.get('user');
    const container = document.getElementById('admin-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="max-width: 1100px; padding: 2.5rem 1.5rem 5rem;">
        <div class="admin-header">
          <div>
            <div class="badge badge-magenta" style="margin-bottom: 0.35rem;">AUTHORIZED ARCHITECT ONLY</div>
            <h1 style="font-size: 2.2rem;">CODE ARENA MANAGEMENT CONSOLE</h1>
          </div>
          <button id="admin-create-problem-btn" class="btn btn-cyber">
            <span>➕</span> NEW CHALLENGE SPEC
          </button>
        </div>

        <!-- System Telemetry & Metrics -->
        <div class="admin-stats-row">
          <div class="admin-stat-card">
            <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--neon-cyan);">48 / 50</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Active Challenges</div>
          </div>
          <div class="admin-stat-card">
            <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--neon-emerald);">32 ms</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Avg Sandbox Execution</div>
          </div>
          <div class="admin-stat-card">
            <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--neon-gold);">99.9%</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">WebSocket Health</div>
          </div>
          <div class="admin-stat-card alert">
            <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--neon-magenta);">0</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Unresolved Reports</div>
          </div>
        </div>

        <!-- Challenge Catalog Management Table -->
        <div class="admin-section">
          <h2 style="font-size: 1.25rem; color: var(--neon-cyan); margin-bottom: 1rem;">CHALLENGE & TEST CASE REGISTRY</h2>

          <div class="table-responsive">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Category</th>
                  <th>Test Cases</th>
                  <th>XP Reward</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.challenges.map(c => `
                  <tr>
                    <td class="font-mono text-cyan">${c.id}</td>
                    <td style="font-weight: 700;">${c.title}</td>
                    <td><span class="badge ${c.difficulty === 'Easy' ? 'badge-easy' : (c.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard')}">${c.difficulty}</span></td>
                    <td><span class="badge badge-cyan">${c.category}</span></td>
                    <td>${c.testCases.length} (${c.testCases.filter(t => t.hidden).length} Hidden)</td>
                    <td class="text-gold font-bold">+${c.xpReward} XP</td>
                    <td>
                      <button class="btn btn-ghost btn-sm edit-problem-btn" data-id="${c.id}">Edit</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- New Challenge Creation Drawer (Modal or Inline Panel) -->
        <div id="new-problem-drawer" class="admin-section" style="display: none; border-color: var(--neon-cyan);">
          <h2 style="font-size: 1.3rem; color: var(--neon-cyan); margin-bottom: 1.25rem;">CREATE CODING CHALLENGE SPECIFICATION</h2>
          
          <form id="create-challenge-form">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label class="form-label">Challenge Title</label>
                <input type="text" id="cp-title" class="form-control" placeholder="e.g. Inverted Binary Tree Raid" required>
              </div>
              <div class="form-group">
                <label class="form-label">Difficulty</label>
                <select id="cp-diff" class="form-control">
                  <option value="Easy">Easy</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">XP Reward</label>
                <input type="number" id="cp-xp" class="form-control" value="250">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Problem Specification Markdown</label>
              <textarea id="cp-desc" class="form-control" rows="4" placeholder="Detail the problem description, constraints, and algorithmic expectations..."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Sample Test Cases (Input &rarr; Expected Output)</label>
              <div class="test-cases-builder">
                <div class="test-case-row">
                  <input type="text" class="form-control" placeholder="Input: [2, 7, 11, 15], 9">
                  <input type="text" class="form-control" placeholder="Expected: [0, 1]">
                  <select class="form-control">
                    <option value="false">Visible</option>
                    <option value="true">Hidden</option>
                  </select>
                  <button type="button" class="btn btn-ghost btn-sm" style="color: var(--neon-red);">&times;</button>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
              <button type="button" class="btn btn-ghost" onclick="document.getElementById('new-problem-drawer').style.display = 'none'">Cancel</button>
              <button type="submit" class="btn btn-cyber">Save Specification</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  bindEvents() {
    const drawer = document.getElementById('new-problem-drawer');
    document.getElementById('admin-create-problem-btn')?.addEventListener('click', () => {
      drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
      drawer.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('create-challenge-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('cp-title').value;
      const difficulty = document.getElementById('cp-diff').value;
      const xpReward = parseInt(document.getElementById('cp-xp').value, 10);
      const desc = document.getElementById('cp-desc').value;

      const newCh = {
        id: 'ch-' + String(this.challenges.length + 1).padStart(2, '0'),
        title,
        difficulty,
        category: 'Custom Admin Spec',
        xpReward,
        timeLimitMs: 1500,
        description: desc || 'Custom challenge specification.',
        examples: [{ input: '[1, 2, 3]', output: '[3, 2, 1]' }],
        constraints: ['1 <= n <= 10^5'],
        starterCode: {
          java: 'class Solution {\n    // Solution template\n}',
          python: 'class Solution:\n    pass',
          cpp: 'class Solution {\n};'
        },
        testCases: [
          { id: 'tc-1', input: '[1, 2, 3]', expected: '[3, 2, 1]', hidden: false },
          { id: 'tc-2', input: '[10, 20]', expected: '[20, 10]', hidden: true }
        ]
      };

      this.challenges.push(newCh);
      drawer.style.display = 'none';
      Toast.success('Challenge Published', `Challenge "${title}" saved to database matrix.`);
      this.render();
      this.bindEvents();
    });

    document.querySelectorAll('.edit-problem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        Toast.info('Challenge Loaded', `Editing parameters for challenge ${id}`);
      });
    });
  }
};
