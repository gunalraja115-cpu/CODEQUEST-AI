/**
 * CodeRoyale — Coding Battle Arena Controller
 * Full esports split HUD, Monaco editor integration, live combat telemetry,
 * real-time damage mechanics, test runner, and authoritative scoring.
 */

import { CodeEditorManager } from '../components/editor.js';
import { api } from '../api.js';
import { sound } from '../sound.js';
import { multiplayer } from '../websocket.js';
import { Toast } from '../components/toast.js';
import { router } from '../router.js';
import { store } from '../state.js';
import { CHALLENGES } from '../mockData.js';

export const ArenaPage = {
  onEnter(params) {
    this.editorManager = new CodeEditorManager('monaco-editor-container');
    this.currentChallenge = store.get('currentChallenge') || CHALLENGES[0];
    this.currentLanguage = 'java';
    this.matchTimer = null;
    this.timeLeftSec = 300; // 5 minutes standard
    this.playerShield = 100;
    this.opponentShield = 100;
    this.activeMatch = store.get('activeMatch');
    this.isSolo = params?.get('mode') === 'solo' || !this.activeMatch;

    this.render();
    this.initEditor();
    this.startMatchTimer();
    this.bindEvents();

    if (!this.isSolo) {
      this.initOpponentLiveTelemetry();
    }
  },

  onLeave() {
    if (this.matchTimer) clearInterval(this.matchTimer);
    multiplayer.stopOpponentCombatSimulation();
  },

  render() {
    const user = store.get('user');
    const ch = this.currentChallenge;
    const opponent = this.activeMatch?.opponent || { username: 'AI Combat Bot', avatar: '🤖', rank: 'Gold', mmr: 1550 };
    const container = document.getElementById('arena-page');
    if (!container) return;

    container.innerHTML = `
      <div class="arena-layout">
        <!-- Left HUD: Challenge Specifications & Combat Telemetry -->
        <div class="arena-left-pane">
          <!-- Combat Telemetry Bar (Hidden in Pure Solo mode) -->
          <div class="battle-telemetry ${this.isSolo ? 'style-solo' : ''}">
            <div class="telemetry-versus">
              <!-- Player -->
              <div class="combatant-card">
                <div class="avatar-frame sm">
                  <div class="avatar-icon">${user.avatar}</div>
                </div>
                <div class="combatant-info">
                  <div class="combatant-name">${user.username}</div>
                  <div class="combatant-rank">${user.rank} • ${user.mmr} MMR</div>
                </div>
              </div>

              <div class="vs-badge">${this.isSolo ? 'DRILL' : 'VS'}</div>

              <!-- Opponent -->
              <div class="combatant-card opponent">
                <div class="avatar-frame sm" style="border-color: var(--neon-magenta);">
                  <div class="avatar-icon">${opponent.avatar}</div>
                </div>
                <div class="combatant-info">
                  <div class="combatant-name">${opponent.username}</div>
                  <div class="combatant-rank">${opponent.rank} • ${opponent.mmr} MMR</div>
                </div>
              </div>
            </div>

            <!-- Health / Nexus Shield Meters -->
            <div class="combat-meter-group">
              <div class="combat-meter-header">
                <span>Player Shield: <strong id="player-shield-val" class="text-cyan">100%</strong></span>
                <span>Opponent Shield: <strong id="opp-shield-val" class="text-magenta">100%</strong></span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <div class="nexus-shield-bar">
                  <div id="player-shield-fill" class="nexus-shield-fill" style="width: 100%;"></div>
                </div>
                <div class="nexus-shield-bar">
                  <div id="opp-shield-fill" class="nexus-shield-fill opponent-fill" style="width: 100%;"></div>
                </div>
              </div>
            </div>

            <!-- Live Combat Log Stream -->
            <div id="combat-log-stream" class="combat-log-stream" style="margin-top: 0.6rem;">
              <div class="combat-log-entry"><span>⚡</span> [SYSTEM] Combat link engaged. Synchronized challenge loaded.</div>
            </div>
          </div>

          <!-- Match Status Header -->
          <div class="match-status-banner">
            <div>
              <span class="badge ${ch.difficulty === 'Easy' ? 'badge-easy' : (ch.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard')}">${ch.difficulty}</span>
              <span class="badge badge-cyan" style="margin-left: 0.35rem;">${ch.category}</span>
            </div>
            <div class="match-timer-box" id="match-timer-display">
              <span>⏱️</span> <span id="timer-text">05:00</span>
            </div>
          </div>

          <!-- Problem Description Pane -->
          <div class="challenge-pane">
            <div class="challenge-title-area">
              <h2 class="challenge-title">${ch.title}</h2>
              <div class="challenge-meta-row">
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Reward: <strong class="text-gold">+${ch.xpReward} XP</strong></span>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Time Limit: <strong>${ch.timeLimitMs}ms</strong></span>
              </div>
            </div>

            <div class="challenge-body">
              <p style="white-space: pre-line;">${ch.description}</p>

              <div class="challenge-section-title">Examples & Inputs</div>
              ${ch.examples.map((ex, i) => `
                <div class="example-box">
                  <div class="example-label">Example ${i + 1}:</div>
                  <div><strong>Input:</strong> ${ex.input}</div>
                  <div><strong>Output:</strong> ${ex.output}</div>
                  ${ex.explanation ? `<div style="color: var(--text-muted); margin-top: 0.2rem;"><em>Explanation:</em> ${ex.explanation}</div>` : ''}
                </div>
              `).join('')}

              <div class="challenge-section-title">Algorithmic Constraints</div>
              <ul style="padding-left: 1.25rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
                ${ch.constraints.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Pane: Monaco Workspace & Test Runner -->
        <div class="arena-right-pane">
          <!-- Editor Toolbar -->
          <div class="editor-toolbar">
            <div class="editor-toolbar-left">
              <select id="arena-lang-select" class="form-control" style="width: 140px; padding: 0.4rem 0.75rem; font-size: 0.85rem;">
                <option value="java" selected>Java 21</option>
                <option value="python">Python 3.11</option>
                <option value="cpp">C++ 20</option>
              </select>

              <button id="arena-ai-hint-btn" class="btn btn-ghost btn-sm" title="Consult CYBER-SAGE AI Coach">
                <span>🤖</span> AI Hint
              </button>
            </div>

            <div class="editor-toolbar-right">
              <button id="arena-run-btn" class="btn btn-ghost btn-sm">
                <span>▶</span> Run Code
              </button>
              <button id="arena-submit-btn" class="btn btn-cyber btn-sm">
                <span>⚔️</span> SUBMIT SOLUTION
              </button>
            </div>
          </div>

          <!-- Monaco Editor Workspace -->
          <div class="editor-workspace">
            <div id="monaco-editor-container"></div>
          </div>

          <!-- Bottom Drawer: Test Results & Terminal Output -->
          <div class="arena-bottom-pane">
            <div class="bottom-pane-tabs">
              <button class="pane-tab active" data-tab="test-cases">Test Cases</button>
              <button class="pane-tab" data-tab="console-output">Execution Console</button>
              <button class="pane-tab" data-tab="ai-advice">AI Coach Feedback</button>
            </div>

            <div id="tab-test-cases" class="bottom-pane-content">
              <div class="test-cases-list" id="arena-test-cases-list">
                ${ch.testCases.map((tc, idx) => `
                  <div class="test-case-item" id="tc-row-${idx}">
                    <div>
                      <span style="color: var(--text-secondary); margin-right: 0.5rem;">Case ${idx + 1}:</span>
                      <span>${tc.hidden ? '<em style="color: var(--text-muted)">[Hidden Official Test Case]</em>' : tc.input}</span>
                    </div>
                    <div class="test-case-status" id="tc-status-${idx}">
                      <span class="badge">PENDING</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div id="tab-console-output" class="bottom-pane-content" style="display: none;">
              <pre id="arena-console-text" style="color: #cbd5e1; line-height: 1.5;">Click "Run Code" to compile and execute against visible test cases.</pre>
            </div>

            <div id="tab-ai-advice" class="bottom-pane-content" style="display: none;">
              <div id="arena-ai-text" style="color: #cbd5e1; line-height: 1.6;">
                Click <strong>"AI Hint"</strong> above to summon CYBER-SAGE's algorithmic deconstruction.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initEditor() {
    const starter = this.currentChallenge.starterCode[this.currentLanguage] || this.currentChallenge.starterCode['java'];
    this.editorManager.init(starter, this.currentLanguage);
  },

  startMatchTimer() {
    const display = document.getElementById('timer-text');
    const timerBox = document.getElementById('match-timer-display');

    this.matchTimer = setInterval(() => {
      this.timeLeftSec -= 1;
      const mins = String(Math.floor(this.timeLeftSec / 60)).padStart(2, '0');
      const secs = String(this.timeLeftSec % 60).padStart(2, '0');

      if (display) display.textContent = `${mins}:${secs}`;

      if (this.timeLeftSec <= 60 && timerBox) {
        timerBox.classList.add('urgent');
      }

      if (this.timeLeftSec <= 0) {
        clearInterval(this.matchTimer);
        this.finishMatch(false, 'TIME EXPIRED');
      }
    }, 1000);
  },

  initOpponentLiveTelemetry() {
    multiplayer.startOpponentCombatSimulation((update) => {
      this.logCombatEvent(update.log, true);
      this.playerShield = Math.max(0, this.playerShield - update.damageDealtToPlayer);

      const pShieldEl = document.getElementById('player-shield-val');
      const pFillEl = document.getElementById('player-shield-fill');
      if (pShieldEl) pShieldEl.textContent = `${this.playerShield}%`;
      if (pFillEl) {
        pFillEl.style.width = `${this.playerShield}%`;
        pFillEl.classList.add('shield-damage-fx');
        setTimeout(() => pFillEl.classList.remove('shield-damage-fx'), 600);
      }

      if (this.playerShield <= 0) {
        this.finishMatch(false, 'OPPONENT DESTROYED YOUR NEXUS');
      }
    });
  },

  logCombatEvent(text, isCrit = false) {
    const stream = document.getElementById('combat-log-stream');
    if (!stream) return;
    const entry = document.createElement('div');
    entry.className = `combat-log-entry ${isCrit ? 'crit' : ''}`;
    entry.innerHTML = `<span>⚡</span> [${new Date().toLocaleTimeString()}] ${text}`;
    stream.prepend(entry);
  },

  bindEvents() {
    // Language change
    document.getElementById('arena-lang-select')?.addEventListener('change', (e) => {
      this.currentLanguage = e.target.value;
      const newStarter = this.currentChallenge.starterCode[this.currentLanguage] || '';
      this.editorManager.setValue(newStarter);
      this.editorManager.setLanguage(this.currentLanguage);
      Toast.info('Language Switched', `Active template set to ${this.currentLanguage.toUpperCase()}`);
    });

    // Tab switching
    document.querySelectorAll('.pane-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.pane-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');

        document.getElementById('tab-test-cases').style.display = target === 'test-cases' ? 'block' : 'none';
        document.getElementById('tab-console-output').style.display = target === 'console-output' ? 'block' : 'none';
        document.getElementById('tab-ai-advice').style.display = target === 'ai-advice' ? 'block' : 'none';
      });
    });

    // Run Code
    document.getElementById('arena-run-btn')?.addEventListener('click', () => this.handleRunCode());

    // Submit Solution
    document.getElementById('arena-submit-btn')?.addEventListener('click', () => this.handleSubmit());

    // AI Hint
    document.getElementById('arena-ai-hint-btn')?.addEventListener('click', () => this.handleAiHint());

    // Keyboard shortcut (Ctrl+Enter to Run)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) this.handleSubmit();
        else this.handleRunCode();
      }
    });
  },

  async handleRunCode() {
    sound.playClick();
    const code = this.editorManager.getValue();
    const consoleText = document.getElementById('arena-console-text');
    if (consoleText) consoleText.textContent = 'Compiling and executing in isolated sandbox...';

    // Switch to console tab
    document.querySelector('.pane-tab[data-tab="console-output"]')?.click();

    const result = await api.runCode(this.currentChallenge.id, this.currentLanguage, code);

    if (consoleText) {
      consoleText.textContent = `=== EXECUTION REPORT ===\nStatus: ${result.status}\nPassed: ${result.passedCount}/${result.totalCount}\nTime: ${result.executionTimeMs}ms\n\n${result.output}`;
    }

    if (result.status === 'Accepted') {
      sound.playLaserAttack();
      Toast.success('Compilation Succeeded', 'Visible test cases verified.');
    } else {
      sound.playDefeat();
      Toast.warning('Test Failures Detected', 'Review the console output.');
    }
  },

  async handleSubmit() {
    sound.playLaserAttack();
    const code = this.editorManager.getValue();
    Toast.info('Evaluating Official Tests', 'Running against authoritative test suite...');

    const result = await api.submitSolution(this.activeMatch?.matchId || 'practice', this.currentChallenge.id, this.currentLanguage, code);

    // Update test cases status in UI
    result.testCases.forEach((tc, idx) => {
      const statusEl = document.getElementById(`tc-status-${idx}`);
      const rowEl = document.getElementById(`tc-row-${idx}`);
      if (statusEl && rowEl) {
        if (tc.passed) {
          rowEl.className = 'test-case-item passed';
          statusEl.innerHTML = '<span class="badge badge-emerald">PASSED</span>';
        } else {
          rowEl.className = 'test-case-item failed';
          statusEl.innerHTML = '<span class="badge badge-magenta">FAILED</span>';
        }
      }
    });

    document.querySelector('.pane-tab[data-tab="test-cases"]')?.click();

    if (result.status === 'Accepted') {
      sound.playVictory();
      this.opponentShield = 0;
      const oppShieldEl = document.getElementById('opp-shield-val');
      const oppFillEl = document.getElementById('opp-shield-fill');
      if (oppShieldEl) oppShieldEl.textContent = '0%';
      if (oppFillEl) oppFillEl.style.width = '0%';

      this.logCombatEvent('CRITICAL CODE STRIKE! 100% Tests Passed — Opponent Nexus Annihilated!', true);

      setTimeout(() => {
        this.finishMatch(true, 'OPPONENT NEXUS DESTROYED', result);
      }, 1200);
    } else {
      sound.playDefeat();
      this.logCombatEvent(`Partial strike: ${result.passedCount}/${result.totalCount} tests passed. Deal ${result.damageDealt}% damage.`);
      this.opponentShield = Math.max(0, this.opponentShield - result.damageDealt);
      const oppFillEl = document.getElementById('opp-shield-fill');
      if (oppFillEl) oppFillEl.style.width = `${this.opponentShield}%`;
      Toast.error('Submission Incomplete', `${result.passedCount}/${result.totalCount} test cases passed.`);
    }
  },

  async handleAiHint() {
    sound.playClick();
    document.querySelector('.pane-tab[data-tab="ai-advice"]')?.click();
    const aiText = document.getElementById('arena-ai-text');
    if (aiText) aiText.innerHTML = '<em>Consulting CYBER-SAGE neural network...</em>';

    const code = this.editorManager.getValue();
    const res = await api.queryAiCoach('Give me a strategic hint for this problem.', this.currentChallenge.title, code);

    if (aiText) {
      aiText.innerHTML = `<div style="font-family: var(--font-body);">${res.response.replace(/\n/g, '<br>')}</div>`;
    }
    Toast.info('AI Hint Delivered', 'Review CYBER-SAGE guidance below.');
  },

  finishMatch(isVictory, reason, resultData = null) {
    if (this.matchTimer) clearInterval(this.matchTimer);
    multiplayer.stopOpponentCombatSimulation();

    // Calculate rating & store result
    const mmrDelta = isVictory ? (resultData?.mmrDelta || 28) : -18;
    const xpReward = isVictory ? (resultData?.xpEarned || 250) : 50;

    store.updateMmr(mmrDelta);
    store.addXP(xpReward);

    const matchOutcome = {
      isVictory,
      reason,
      challenge: this.currentChallenge,
      opponent: this.activeMatch?.opponent || { username: 'AI Gladiator', avatar: '🤖' },
      duration: '02:35',
      xpEarned: xpReward,
      mmrDelta,
      testsPassed: resultData?.passedCount || (isVictory ? 5 : 2),
      totalTests: resultData?.totalCount || 5
    };

    store.set('lastMatchOutcome', matchOutcome);
    router.navigate('results');
  }
};
