/**
 * CodeRoyale — Matchmaking & Waiting Lobby Controller
 */

import { multiplayer } from '../websocket.js';
import { sound } from '../sound.js';
import { router } from '../router.js';
import { store } from '../state.js';

export const MatchmakingPage = {
  onEnter() {
    this.countdownTimer = null;
    this.render();
    this.startQueue();
  },

  onLeave() {
    multiplayer.cancelMatchmaking();
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  },

  render() {
    const user = store.get('user');
    const container = document.getElementById('matchmaking-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="max-width: 680px; padding: 4rem 1.5rem; text-align: center;">
        <div class="holo-panel hud-corner">
          <!-- Radar Scanning Container -->
          <div id="radar-container" style="margin-bottom: 2rem;">
            <div style="position: relative; width: 180px; height: 180px; margin: 0 auto; border-radius: 50%; border: 2px solid var(--neon-cyan); background: radial-gradient(circle, rgba(0,240,255,0.05) 0%, rgba(10,14,26,0.85) 100%); overflow: hidden; box-shadow: 0 0 25px rgba(0,240,255,0.25);">
              <div style="position: absolute; inset: 0; background: conic-gradient(from 0deg, transparent 0deg, rgba(0, 240, 255, 0.4) 60deg, transparent 65deg); animation: radarSweep 2s linear infinite;"></div>
              <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(0,240,255,0.2);"></div>
              <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(0,240,255,0.2);"></div>
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: var(--neon-cyan); border-radius: 50%; box-shadow: 0 0 10px var(--neon-cyan);"></div>
            </div>
            
            <h2 id="queue-status-text" style="font-size: 1.5rem; color: var(--neon-cyan); margin-top: 1.5rem; margin-bottom: 0.25rem;">
              SEARCHING FOR GLADIATOR...
            </h2>
            <div id="queue-timer-val" class="font-mono" style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Queue Time: 00:00
            </div>
            
            <button id="cancel-queue-btn" class="btn btn-ghost">
              Cancel Search
            </button>
          </div>

          <!-- Opponent Holographic Reveal & Ready Check (Hidden initially) -->
          <div id="match-reveal-container" style="display: none;">
            <div class="badge badge-magenta" style="margin-bottom: 1rem; font-size: 0.9rem;">MATCH FOUND • COMMENCING READY CHECK</div>
            
            <div style="display: flex; align-items: center; justify-content: space-around; margin: 2rem 0; gap: 1rem;">
              <!-- You -->
              <div style="flex: 1;">
                <div class="avatar-frame lg" style="margin: 0 auto 0.75rem;">
                  <div class="avatar-icon">${user.avatar}</div>
                </div>
                <div class="font-display" style="font-size: 1.1rem;">${user.username}</div>
                <div style="font-size: 0.8rem; color: var(--neon-cyan);">${user.rank} • ${user.mmr} MMR</div>
                <span class="badge badge-emerald" style="margin-top: 0.5rem;">READY</span>
              </div>

              <div class="vs-badge" style="font-size: 2rem;">VS</div>

              <!-- Opponent -->
              <div style="flex: 1;">
                <div class="avatar-frame lg" style="margin: 0 auto 0.75rem; border-color: var(--neon-magenta);">
                  <div id="opponent-reveal-avatar" class="avatar-icon">⚡</div>
                </div>
                <div id="opponent-reveal-name" class="font-display" style="font-size: 1.1rem;">QuantumGhost</div>
                <div id="opponent-reveal-rank" style="font-size: 0.8rem; color: var(--neon-magenta);">Platinum • 1610 MMR</div>
                <span id="opponent-ready-badge" class="badge badge-cyan" style="margin-top: 0.5rem;">LOCKED IN</span>
              </div>
            </div>

            <!-- Ready Countdown -->
            <div style="margin: 2rem 0 1rem;">
              <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.5rem;">
                COMBAT INITIATION IN
              </div>
              <div id="countdown-number" class="font-display text-magenta" style="font-size: 3.5rem; font-weight: 900; line-height: 1;">
                5
              </div>
            </div>

            <button id="lock-in-btn" class="btn btn-cyber btn-lg" style="width: 100%;">
              <span>⚔️</span> ACCEPT BATTLE ENGAGEMENT
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('cancel-queue-btn')?.addEventListener('click', () => {
      multiplayer.cancelMatchmaking();
      router.navigate('modes');
    });
  },

  startQueue() {
    const statusText = document.getElementById('queue-status-text');
    const timerVal = document.getElementById('queue-timer-val');

    multiplayer.startMatchmaking(
      '1v1_ranked',
      (prog) => {
        const mins = String(Math.floor(prog.elapsed / 60)).padStart(2, '0');
        const secs = String(prog.elapsed % 60).padStart(2, '0');
        if (timerVal) timerVal.textContent = `Queue Time: ${mins}:${secs}`;
      },
      (matchData) => {
        this.handleMatchFound(matchData);
      }
    );
  },

  handleMatchFound(matchData) {
    document.getElementById('radar-container').style.display = 'none';
    const reveal = document.getElementById('match-reveal-container');
    reveal.style.display = 'block';

    document.getElementById('opponent-reveal-name').textContent = matchData.opponent.username;
    document.getElementById('opponent-reveal-avatar').textContent = matchData.opponent.avatar;
    document.getElementById('opponent-reveal-rank').textContent = `${matchData.opponent.rank} • ${matchData.opponent.mmr} MMR`;

    store.set('activeMatch', matchData);

    let count = 5;
    const countEl = document.getElementById('countdown-number');

    this.countdownTimer = setInterval(() => {
      count -= 1;
      sound.playCountdownTick();
      if (countEl) countEl.textContent = count;

      if (count <= 0) {
        clearInterval(this.countdownTimer);
        router.navigate('arena?matchId=' + matchData.matchId);
      }
    }, 1000);

    document.getElementById('lock-in-btn')?.addEventListener('click', () => {
      clearInterval(this.countdownTimer);
      router.navigate('arena?matchId=' + matchData.matchId);
    });
  }
};
