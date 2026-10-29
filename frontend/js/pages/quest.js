/**
 * CodeRoyale — Quest Map & Daily Missions Controller
 * Interactive galactic skill tree with circuit progress and daily bounties.
 */

import { QUEST_NODES, DAILY_QUESTS, CHALLENGES } from '../mockData.js';
import { sound } from '../sound.js';
import { Toast } from '../components/toast.js';
import { router } from '../router.js';
import { store } from '../state.js';

export const QuestPage = {
  onEnter() {
    this.nodes = store.get('questNodes') || [...QUEST_NODES];
    this.dailyQuests = store.get('dailyQuests') || [...DAILY_QUESTS];
    this.render();
    this.bindEvents();
  },

  render() {
    const user = store.get('user');
    const container = document.getElementById('quest-page');
    if (!container) return;

    const completedNodes = this.nodes.filter(n => n.status === 'completed').length;
    const totalNodes = this.nodes.length;
    const progressPct = Math.round((completedNodes / totalNodes) * 100);

    container.innerHTML = `
      <div class="container quest-container" style="padding: 2.5rem 1.5rem 5rem;">
        <!-- Header Matrix -->
        <div class="quest-header-bar hud-corner">
          <div>
            <div class="badge badge-emerald" style="margin-bottom: 0.35rem;">GALACTIC PROGRESSION SECTOR</div>
            <h1 style="font-size: 2rem;">SKILL EVOLUTION MAP</h1>
          </div>

          <div class="quest-stats-group">
            <div class="quest-stat-pill">
              <span>🌟 Completed Nodes:</span>
              <span class="quest-stat-value">${completedNodes} / ${totalNodes}</span>
            </div>
            <div class="quest-stat-pill">
              <span>⚡ Galactic Sync:</span>
              <span class="quest-stat-value">${progressPct}%</span>
            </div>
          </div>
        </div>

        <!-- Interactive Quest Star Map -->
        <div class="quest-tree-board">
          <div style="font-family: var(--font-heading); font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 1.5rem;">
            SECTOR PATH: JAVA & ALGORITHMIC FUNDAMENTALS &rarr; FINAL BOSS GATE
          </div>

          <div class="quest-tree-path">
            <!-- Connecting Glowing Circuit Line -->
            <div class="quest-tree-track">
              <div class="quest-tree-track-fill" style="width: ${progressPct}%;"></div>
            </div>

            <!-- Nodes -->
            ${this.nodes.map(node => `
              <div class="quest-node ${node.status}" data-node-id="${node.id}" title="${node.title} (${node.category})">
                <div class="quest-node-orb">
                  ${node.icon}
                </div>
                <div class="quest-node-title">${node.title}</div>
                <div class="quest-node-stars">
                  ${'★'.repeat(node.stars)}${'☆'.repeat(3 - node.stars)}
                </div>
                <span class="badge ${node.status === 'completed' ? 'badge-emerald' : (node.status === 'current' ? 'badge-cyan' : 'badge-gold')}" style="font-size: 0.65rem;">
                  ${node.status.toUpperCase()}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Daily & Weekly Bounties Section -->
        <div class="cyber-card" style="margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <span class="badge badge-gold">DAILY PROTOCOLS</span>
              <h2 style="font-size: 1.3rem; margin-top: 0.25rem;">DAILY CODING BOUNTIES & MISSIONS</h2>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">Resets in: <strong class="text-cyan">14h 22m</strong></div>
          </div>

          <div class="daily-quests-grid">
            ${this.dailyQuests.map((dq, idx) => `
              <div class="daily-quest-card">
                <div>
                  <div class="daily-quest-header">
                    <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1rem;">${dq.title}</span>
                    <span class="daily-quest-reward">+${dq.rewardXp} XP • ${dq.rewardGold} G</span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin: 0.5rem 0;">
                    Combat Objective: Fulfill conditions to claim matrix bounty.
                  </div>
                  <div class="progress-container" style="height: 10px;">
                    <div class="progress-bar ${dq.completed ? 'emerald' : ''}" style="width: ${Math.round((dq.progress / dq.total) * 100)}%;"></div>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                    Status: ${dq.progress} / ${dq.total} Completed
                  </div>
                </div>

                <button class="btn ${dq.completed ? 'btn-ghost' : (dq.progress >= dq.total ? 'btn-emerald' : 'btn-cyber')} btn-sm claim-quest-btn" data-quest-idx="${idx}" ${dq.completed ? 'disabled' : ''}>
                  ${dq.completed ? '✓ CLAIMED' : (dq.progress >= dq.total ? 'CLAIM BOUNTY' : 'ENGAGE MISSION')}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.querySelectorAll('.quest-node').forEach(nodeEl => {
      nodeEl.addEventListener('click', () => {
        const nodeId = nodeEl.getAttribute('data-node-id');
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        if (node.status === 'locked') {
          sound.playDefeat();
          Toast.warning('Node Encrypted', 'You must complete prior prerequisite nodes to unlock this trial.');
          return;
        }

        sound.playClick();
        const ch = CHALLENGES.find(c => c.id === node.challengeId) || CHALLENGES[0];
        store.set('currentChallenge', ch);
        Toast.info('Mission Activated', `Entering simulation node: ${node.title}`);
        router.navigate('arena?mode=solo');
      });
    });

    document.querySelectorAll('.claim-quest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-quest-idx'), 10);
        const quest = this.dailyQuests[idx];
        if (quest && !quest.completed) {
          sound.playVictory();
          quest.completed = true;
          quest.progress = quest.total;
          store.addXP(quest.rewardXp);
          store.set('dailyQuests', this.dailyQuests);
          Toast.success('Bounty Claimed', `Earned +${quest.rewardXp} XP and +${quest.rewardGold} Gold!`);
          this.render();
          this.bindEvents();
        }
      });
    });
  }
};
