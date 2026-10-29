/**
 * CodeRoyale — Game Modes Hub Controller
 */

import { router } from '../router.js';

export const ModesPage = {
  onEnter() {
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('modes-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="padding: 2.5rem 1.5rem 4rem;">
        <div style="text-align: center; margin-bottom: 3rem;">
          <div class="badge badge-cyan" style="margin-bottom: 0.75rem;">COMBAT SIMULATION MATRICES</div>
          <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">SELECT GAME MODE</h1>
          <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto;">Choose your trial: test your solo algorithm mastery, clash in competitive 1v1 duels, rally friends, or raid cyber bosses.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem;">
          <!-- 1v1 Ranked -->
          <div class="cyber-card" style="border-color: rgba(255, 0, 127, 0.4); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="font-size: 2.5rem;">⚔️</div>
                <span class="badge badge-magenta">COMPETITIVE MMR</span>
              </div>
              <h3 style="font-size: 1.4rem; color: var(--neon-magenta); margin-bottom: 0.5rem;">Ranked 1v1 Code Duel</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.25rem;">
                Skill-based matchmaking. Both gladiators receive the exact same challenge. Pass test cases to deplete opponent's nexus shield.
              </p>
              <ul style="color: var(--text-muted); font-size: 0.85rem; list-style: none; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.5rem;">
                <li>✓ Synchronized countdown & timer</li>
                <li>✓ Official server-side test evaluation</li>
                <li>✓ Elo / MMR rating adjustments</li>
              </ul>
            </div>
            <button class="btn btn-danger" onclick="window.location.hash = 'matchmaking'" style="width: 100%;">
              <span>⚡</span> QUEUE RANKED 1v1
            </button>
          </div>

          <!-- Solo Practice -->
          <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="font-size: 2.5rem;">🎯</div>
                <span class="badge badge-cyan">CASUAL / DRILL</span>
              </div>
              <h3 style="font-size: 1.4rem; color: var(--neon-cyan); margin-bottom: 0.5rem;">Solo Practice</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.25rem;">
                Solve challenges at your own rhythm without timer pressure. Gain full access to CYBER-SAGE progressive hints and complexity analysis.
              </p>
              <ul style="color: var(--text-muted); font-size: 0.85rem; list-style: none; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.5rem;">
                <li>✓ Filter by difficulty & category</li>
                <li>✓ Full AI hints & error deconstructions</li>
                <li>✓ XP progression towards badges</li>
              </ul>
            </div>
            <button class="btn btn-cyber" onclick="window.location.hash = 'arena?mode=solo'" style="width: 100%;">
              <span>🚀</span> START PRACTICE
            </button>
          </div>

          <!-- Friend Rooms -->
          <div class="cyber-card" style="border-color: rgba(168, 85, 247, 0.4); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="font-size: 2.5rem;">🤝</div>
                <span class="badge badge-violet">PRIVATE ROOMS</span>
              </div>
              <h3 style="font-size: 1.4rem; color: var(--neon-purple); margin-bottom: 0.5rem;">Friend Custom Lobbies</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.25rem;">
                Host custom battles using 6-character room codes. Configure challenge parameters, match duration, and permitted languages.
              </p>
              <ul style="color: var(--text-muted); font-size: 0.85rem; list-style: none; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.5rem;">
                <li>✓ Instant invite code generation</li>
                <li>✓ Host rules customization</li>
                <li>✓ Rematch and spectator options</li>
              </ul>
            </div>
            <button class="btn btn-violet" onclick="window.location.hash = 'rooms'" style="width: 100%;">
              <span>🔑</span> ENTER CUSTOM ROOM
            </button>
          </div>

          <!-- Team Battles 2v2 -->
          <div class="cyber-card" style="border-color: rgba(255, 215, 0, 0.4); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="font-size: 2.5rem;">🛡️</div>
                <span class="badge badge-gold">CO-OP BATTLE</span>
              </div>
              <h3 style="font-size: 1.4rem; color: var(--neon-gold); margin-bottom: 0.5rem;">Team Battles — 2v2</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.25rem;">
                Form two-gladiator squads to combine test scores and attack points in shared arena objectives.
              </p>
              <ul style="color: var(--text-muted); font-size: 0.85rem; list-style: none; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.5rem;">
                <li>✓ Shared team nexus shield</li>
                <li>✓ Synergistic test passing damage</li>
                <li>✓ Team ranking leaderboards</li>
              </ul>
            </div>
            <button class="btn btn-gold" onclick="window.location.hash = 'rooms?mode=team'" style="width: 100%;">
              <span>👥</span> FORM SQUAD
            </button>
          </div>

          <!-- Boss Raid -->
          <div class="cyber-card" style="border-color: rgba(255, 51, 102, 0.5); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="font-size: 2.5rem;">👾</div>
                <span class="badge badge-magenta">EPIC PVE RAIDS</span>
              </div>
              <h3 style="font-size: 1.4rem; color: var(--neon-red); margin-bottom: 0.5rem;">Boss Battle Challenges</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.25rem;">
                Conquer 5 rogue titans: Bug Hunter, Loop Titan, Array Beast, Logic Phantom, and Algorithm Overlord.
              </p>
              <ul style="color: var(--text-muted); font-size: 0.85rem; list-style: none; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.5rem;">
                <li>✓ Multi-phase boss HP bars</li>
                <li>✓ Enraged boss phase mechanics</li>
                <li>✓ Rare legendary badge drops</li>
              </ul>
            </div>
            <button class="btn btn-danger" onclick="window.location.hash = 'boss'" style="width: 100%;">
              <span>👹</span> RAID BOSSES
            </button>
          </div>

          <!-- Galactic Quest Map -->
          <div class="cyber-card" style="border-color: rgba(0, 245, 155, 0.4); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="font-size: 2.5rem;">🗺️</div>
                <span class="badge badge-emerald">PROGRESSION TREE</span>
              </div>
              <h3 style="font-size: 1.4rem; color: var(--neon-emerald); margin-bottom: 0.5rem;">Galactic Quest Map</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.25rem;">
                Progress along the linear circuit from basic variables to graph traversals and final boss gates.
              </p>
              <ul style="color: var(--text-muted); font-size: 0.85rem; list-style: none; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.5rem;">
                <li>✓ Connected milestone nodes</li>
                <li>✓ Daily and weekly quest chests</li>
                <li>✓ Star ratings per completed mission</li>
              </ul>
            </div>
            <button class="btn btn-emerald" onclick="window.location.hash = 'quest'" style="width: 100%;">
              <span>🌌</span> EXPLORE MAP
            </button>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {}
};
