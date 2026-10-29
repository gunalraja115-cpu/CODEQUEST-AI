/**
 * CodeRoyale — Friend Custom Rooms & Team 2v2 Controller
 */

import { multiplayer } from '../websocket.js';
import { Toast } from '../components/toast.js';
import { router } from '../router.js';
import { store } from '../state.js';

export const RoomsPage = {
  onEnter() {
    this.currentRoom = store.get('activeRoom');
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('rooms-page');
    if (!container) return;

    if (!this.currentRoom) {
      this.renderLobbySelect(container);
    } else {
      this.renderInsideRoom(container);
    }
  },

  renderLobbySelect(container) {
    container.innerHTML = `
      <div class="container" style="max-width: 900px; padding: 3rem 1.5rem 5rem;">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div class="badge badge-violet" style="margin-bottom: 0.75rem;">CUSTOM BATTLE LOBBIES</div>
          <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">FRIEND & SQUAD ARENAS</h1>
          <p style="color: var(--text-secondary);">Create private rooms, invite squadmates with room codes, or customize tournament rules.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 2rem;">
          <!-- Create Room Panel -->
          <div class="cyber-card" style="border-color: rgba(168, 85, 247, 0.4);">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🛠️</div>
            <h3 style="font-size: 1.3rem; color: var(--neon-purple); margin-bottom: 0.5rem;">Initialize Custom Room</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">Host a match with your preferred problem difficulty, language filters, and participant slots.</p>

            <form id="create-room-form">
              <div class="form-group">
                <label class="form-label">Arena Name</label>
                <input type="text" id="cr-name" class="form-control" value="Cyber Duel Arena" required>
              </div>

              <div class="form-group">
                <label class="form-label">Battle Format</label>
                <select id="cr-mode" class="form-control">
                  <option value="1v1">1v1 Duel (2 Players)</option>
                  <option value="2v2">2v2 Squad Clash (4 Players)</option>
                  <option value="free-for-all">Free For All (Up to 6 Players)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Algorithmic Difficulty</label>
                <select id="cr-diff" class="form-control">
                  <option value="Any">Mixed Tier</option>
                  <option value="Easy">Easy (Fundamentals)</option>
                  <option value="Medium" selected>Medium (Standard)</option>
                  <option value="Hard">Hard (Expert)</option>
                </select>
              </div>

              <button type="submit" class="btn btn-violet" style="width: 100%; margin-top: 1rem;">
                <span>✨</span> CREATE ROOM
              </button>
            </form>
          </div>

          <!-- Join Room Panel -->
          <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔑</div>
              <h3 style="font-size: 1.3rem; color: var(--neon-cyan); margin-bottom: 0.5rem;">Join With Room Code</h3>
              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">Have an invite from a friend? Enter the 6-character quantum transmission code.</p>

              <form id="join-room-form">
                <div class="form-group">
                  <label class="form-label">6-Character Quantum Room Code</label>
                  <input type="text" id="join-code-input" class="form-control font-mono" placeholder="e.g. CR789X" maxlength="6" style="text-transform: uppercase; font-size: 1.25rem; letter-spacing: 0.2em; text-align: center;" required>
                </div>

                <button type="submit" class="btn btn-cyber" style="width: 100%; margin-top: 1rem;">
                  <span>🚀</span> JOIN ARENA
                </button>
              </form>
            </div>

            <!-- Active Public Rooms Preview -->
            <div style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.08);">
              <div style="font-family: var(--font-heading); font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.75rem;">
                Public Broadcast Lobbies
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(10,14,26,0.6); padding: 0.5rem 0.75rem; border-radius: var(--border-radius-sm);">
                  <div>
                    <span style="font-weight: 700; font-size: 0.85rem;">Alpha Squad Duel</span>
                    <span class="badge badge-cyan" style="margin-left: 0.5rem;">2v2</span>
                  </div>
                  <button class="btn btn-ghost btn-sm" onclick="RoomsPage.quickJoin('ALPHA9')">Join</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderInsideRoom(container) {
    const room = this.currentRoom;
    const user = store.get('user');
    const isHost = room.host === user.username;

    container.innerHTML = `
      <div class="container" style="max-width: 900px; padding: 2.5rem 1.5rem 5rem;">
        <div class="holo-panel hud-corner">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,240,255,0.15); padding-bottom: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-violet">${room.mode.toUpperCase()} LOBBY</span>
              <h2 style="font-size: 1.6rem; color: var(--text-primary); margin-top: 0.25rem;">${room.name}</h2>
            </div>
            
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Room Code</div>
                <div id="room-code-tag" class="font-mono text-cyan" style="font-size: 1.5rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer;" title="Click to copy">
                  ${room.code} 📋
                </div>
              </div>
              <button id="leave-room-btn" class="btn btn-ghost btn-sm">Leave Room</button>
            </div>
          </div>

          <!-- Room Config Summary -->
          <div style="display: flex; gap: 1rem; margin-bottom: 1.75rem; flex-wrap: wrap;">
            <div class="badge badge-cyan">Difficulty: ${room.difficulty}</div>
            <div class="badge badge-gold">Language: ${room.language}</div>
            <div class="badge badge-emerald">Host: ${room.host}</div>
          </div>

          <!-- Participant Roster -->
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.1rem; color: var(--neon-cyan); margin-bottom: 1rem;">CONNECTED GLADIATORS (${room.participants.length}/${room.maxPlayers})</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
              ${room.participants.map(p => `
                <div class="cyber-card" style="padding: 1rem; display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="avatar-frame md">
                      <div class="avatar-icon">${p.avatar || '🥷'}</div>
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size: 0.95rem;">${p.username} ${p.isHost ? '👑' : ''}</div>
                      <div style="font-size: 0.75rem; color: var(--text-secondary);">${p.rank || 'Gold'}</div>
                    </div>
                  </div>
                  <span class="badge ${p.isReady ? 'badge-emerald' : 'badge-gold'}">${p.isReady ? 'READY' : 'WAITING'}</span>
                </div>
              `).join('')}

              ${room.participants.length < room.maxPlayers ? `
                <div class="cyber-card" style="padding: 1rem; display: flex; align-items: center; justify-content: center; border-style: dashed; border-color: rgba(148,163,184,0.3); color: var(--text-muted);">
                  <span>+ Waiting for gladiator to join...</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Room Action Controls -->
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button id="toggle-ready-btn" class="btn btn-ghost">
              Toggle Ready Status
            </button>
            ${isHost ? `
              <button id="start-room-match-btn" class="btn btn-cyber btn-lg">
                <span>🚀</span> LAUNCH SYNCHRONIZED MATCH
              </button>
            ` : `
              <div style="color: var(--text-secondary); align-self: center; font-size: 0.85rem;">
                Waiting for host to commence battle...
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    document.getElementById('room-code-tag')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(room.code);
      Toast.info('Code Copied', 'Quantum room code copied to clipboard!');
    });

    document.getElementById('leave-room-btn')?.addEventListener('click', () => {
      store.set('activeRoom', null);
      this.currentRoom = null;
      this.render();
      this.bindEvents();
    });

    document.getElementById('toggle-ready-btn')?.addEventListener('click', () => {
      Toast.success('Status Updated', 'You are marked as combat ready!');
    });

    document.getElementById('start-room-match-btn')?.addEventListener('click', () => {
      Toast.success('Match Synchronized', 'Launching battle arena...');
      store.set('activeMatch', {
        matchId: 'room-' + room.code,
        mode: room.mode,
        opponent: { username: 'LobbyGladiator', avatar: '🧙‍♂️', rank: 'Platinum', mmr: 1620 },
        durationSec: 300
      });
      router.navigate('arena?matchId=room-' + room.code);
    });
  },

  quickJoin(code) {
    const room = multiplayer.joinRoom(code);
    this.currentRoom = room;
    Toast.success('Arena Joined', `Connected to room ${code}!`);
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('create-room-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cr-name').value;
      const mode = document.getElementById('cr-mode').value;
      const difficulty = document.getElementById('cr-diff').value;

      const room = multiplayer.createRoom({ name, mode, difficulty, maxPlayers: mode === '2v2' ? 4 : 2 });
      this.currentRoom = room;
      Toast.success('Room Initialized', `Room code: ${room.code}`);
      this.render();
      this.bindEvents();
    });

    document.getElementById('join-room-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('join-code-input').value.trim();
      if (code) {
        this.quickJoin(code);
      }
    });
  }
};
