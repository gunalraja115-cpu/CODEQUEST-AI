/**
 * CodeRoyale — AI Coding Coach ("CYBER-SAGE") Controller
 * Sci-Fi game assistant HUD with progressive hints and algorithmic review.
 */

import { api } from '../api.js';
import { sound } from '../sound.js';
import { Toast } from '../components/toast.js';
import { store } from '../state.js';

export const AiCoachPage = {
  onEnter() {
    this.messages = [
      {
        sender: 'ai',
        text: 'Greetings Gladiator. I am **CYBER-SAGE**, your tactical AI coding coach. Whether you require algorithmic hints, time-complexity audits, or syntax debugging, query my neural matrix below.',
        time: 'Just now'
      }
    ];
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('aicoach-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="max-width: 960px; padding: 2.5rem 1.5rem 5rem;">
        <div class="holo-panel hud-corner" style="display: flex; flex-direction: column; height: 75vh;">
          <!-- AI Coach Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,240,255,0.15); padding-bottom: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="position: relative; width: 50px; height: 50px; border-radius: 50%; background: #0a0e1a; border: 2px solid var(--neon-cyan); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 0 15px rgba(0,240,255,0.5);">
                🤖
              </div>
              <div>
                <h2 style="font-size: 1.3rem; color: var(--neon-cyan);">CYBER-SAGE v4.2</h2>
                <div style="font-size: 0.75rem; color: var(--neon-emerald); display: flex; align-items: center; gap: 0.35rem;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--neon-emerald); box-shadow: 0 0 8px var(--neon-emerald);"></span>
                  NEURAL CO-PROCESSOR ONLINE
                </div>
              </div>
            </div>

            <div class="badge badge-cyan">SECURE BACKEND PROXY</div>
          </div>

          <!-- Quick Tactical Action Chips -->
          <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
            <button class="btn btn-ghost btn-sm quick-ai-chip" data-query="Explain the problem in simple terms.">
              💡 Explain Problem
            </button>
            <button class="btn btn-ghost btn-sm quick-ai-chip" data-query="Give me a progressive hint without spoiling the solution.">
              🔍 Progressive Hint
            </button>
            <button class="btn btn-ghost btn-sm quick-ai-chip" data-query="What is the optimal Time and Space Complexity?">
              ⏱️ Complexity Audit
            </button>
            <button class="btn btn-ghost btn-sm quick-ai-chip" data-query="Review common edge cases for arrays and hash maps.">
              🛡️ Edge-Case Review
            </button>
          </div>

          <!-- Chat Messages Body -->
          <div id="ai-chat-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding: 1rem; background: rgba(10,14,26,0.65); border-radius: var(--border-radius-md); border: 1px solid rgba(0,240,255,0.1);">
            ${this.messages.map(m => this.renderMessage(m)).join('')}
          </div>

          <!-- Chat Input Controls -->
          <form id="ai-chat-form" style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <input type="text" id="ai-user-input" class="form-control" placeholder="Ask CYBER-SAGE about algorithms, complexity, or debugging..." autocomplete="off" required>
            <button type="submit" class="btn btn-cyber" style="white-space: nowrap;">
              <span>⚡</span> TRANSMIT
            </button>
          </form>
        </div>
      </div>
    `;
  },

  renderMessage(msg) {
    const isAi = msg.sender === 'ai';
    return `
      <div style="display: flex; gap: 0.75rem; align-items: flex-start; ${isAi ? '' : 'flex-direction: row-reverse;'}">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: #0a0e1a; border: 1px solid ${isAi ? 'var(--neon-cyan)' : 'var(--neon-magenta)'}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
          ${isAi ? '🤖' : '🥷'}
        </div>
        <div style="max-width: 80%; background: ${isAi ? 'rgba(16, 24, 48, 0.85)' : 'rgba(30, 20, 60, 0.85)'}; border: 1px solid ${isAi ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 0, 127, 0.2)'}; border-radius: var(--border-radius-md); padding: 0.85rem 1.15rem; font-size: 0.95rem; line-height: 1.6;">
          <div style="font-family: var(--font-heading); font-size: 0.75rem; color: ${isAi ? 'var(--neon-cyan)' : 'var(--neon-magenta)'}; margin-bottom: 0.25rem;">
            ${isAi ? 'CYBER-SAGE' : 'YOU'} • ${msg.time}
          </div>
          <div>${msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    const chatBody = document.getElementById('ai-chat-body');
    const form = document.getElementById('ai-chat-form');
    const input = document.getElementById('ai-user-input');

    const appendMsg = (sender, text) => {
      const msg = { sender, text, time: new Date().toLocaleTimeString() };
      this.messages.push(msg);
      chatBody.insertAdjacentHTML('beforeend', this.renderMessage(msg));
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      input.value = '';
      sound.playClick();
      appendMsg('user', query);

      // Show typing indicator
      const typingEl = document.createElement('div');
      typingEl.id = 'ai-typing-indicator';
      typingEl.style.color = 'var(--text-secondary)';
      typingEl.style.fontSize = '0.85rem';
      typingEl.style.fontStyle = 'italic';
      typingEl.textContent = 'CYBER-SAGE is processing neural tensors...';
      chatBody.appendChild(typingEl);
      chatBody.scrollTop = chatBody.scrollHeight;

      try {
        const res = await api.queryAiCoach(query, 'General Practice Arena', '');
        typingEl.remove();
        appendMsg('ai', res.response);
      } catch (err) {
        typingEl.remove();
        appendMsg('ai', 'Neural signal interference encountered. Please try again.');
      }
    });

    document.querySelectorAll('.quick-ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        if (input) input.value = q;
        form?.dispatchEvent(new Event('submit'));
      });
    });
  }
};
