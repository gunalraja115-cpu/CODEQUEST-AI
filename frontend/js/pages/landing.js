/**
 * CodeRoyale — Landing Page Controller
 */

import { router } from '../router.js';
import { sound } from '../sound.js';
import { store } from '../state.js';

export const LandingPage = {
  onEnter() {
    this.render();
    this.bindEvents();
  },

  render() {
    const user = store.get('user');
    const container = document.getElementById('landing-page');
    if (!container) return;

    container.innerHTML = `
      <section class="hero-section" style="padding: 4rem 1.5rem 3rem; text-align: center; position: relative;">
        <div class="container" style="max-width: 900px;">
          <div class="badge badge-cyan" style="margin-bottom: 1.5rem; padding: 0.4rem 1rem;">
            <span>⚡</span> SEASON 4: CYBERNETIC ASCENSION IS LIVE
          </div>
          
          <h1 style="font-size: clamp(2.5rem, 6vw, 4.2rem); line-height: 1.1; margin-bottom: 1.5rem; text-shadow: 0 0 30px rgba(0,240,255,0.4);">
            BATTLE WITH <span class="gradient-text-cyan">CODE</span>.<br>
            CONQUER THE <span class="gradient-text-fire">ARENA</span>.
          </h1>

          <p style="font-size: 1.2rem; color: var(--text-secondary); max-width: 680px; margin: 0 auto 2.5rem; line-height: 1.6;">
            Code Quest is the premier full-stack competitive coding battle arena. Clash in 1v1 ranked duels, defeat multi-stage AI bosses, explore the galactic quest tree, and ascend the global leaderboards.
          </p>

          <div style="display: flex; gap: 1.25rem; justify-content: center; flex-wrap: wrap;">
            <button id="hero-play-btn" class="btn btn-cyber btn-lg">
              <span>⚔️</span> ENTER ARENA
            </button>
            <button id="hero-login-btn" class="btn btn-gold btn-lg">
              <span>⚡</span> SIGN IN / ENLIST
            </button>
            <button id="hero-modes-btn" class="btn btn-violet btn-lg">
              <span>🎮</span> EXPLORE GAME MODES
            </button>
            <button id="hero-boss-btn" class="btn btn-danger btn-lg">
              <span>👾</span> BOSS RAIDS
            </button>
          </div>

          <!-- Live Esports Stats Ticker -->
          <div class="cyber-card" style="margin-top: 3.5rem; padding: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem;">
            <div>
              <div class="font-display" style="font-size: 1.8rem; color: var(--neon-cyan);">148,920</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase;">Battles Fought</div>
            </div>
            <div>
              <div class="font-display" style="font-size: 1.8rem; color: var(--neon-magenta);">32,450</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase;">Gladiators Online</div>
            </div>
            <div>
              <div class="font-display" style="font-size: 1.8rem; color: var(--neon-gold);">99.98%</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase;">Sandbox Uptime</div>
            </div>
            <div>
              <div class="font-display" style="font-size: 1.8rem; color: var(--neon-emerald);">3 Tiers</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase;">Java • Python • C++</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Game Highlights Grid -->
      <section style="padding: 3rem 1.5rem 3rem;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">AN AUTHENTIC ESPORTS EXPERIENCE</h2>
            <p style="color: var(--text-secondary);">70% Gaming Atmosphere • 30% Pure Algorithmic Combat</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            <div class="cyber-card">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚔️</div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--neon-cyan);">1v1 Ranked Duels</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5;">
                Climb from Bronze to Champion. Pass test cases to cast real-time digital attacks that deplete your opponent's nexus shield.
              </p>
            </div>

            <div class="cyber-card">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">👾</div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--neon-magenta);">Epic Boss Raids</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5;">
                Face the Bug Hunter, Loop Titan, and Algorithm Overlord across multi-phase algorithmic challenges with animated health bars.
              </p>
            </div>

            <div class="cyber-card">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">🗺️</div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--neon-gold);">Galactic Skill Tree</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5;">
                Journey through interconnected quest nodes from syntax foundations to advanced dynamic programming and graph structures.
              </p>
            </div>

            <div class="cyber-card">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">🤖</div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--neon-purple);">CYBER-SAGE AI Coach</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5;">
                Get contextual hints, algorithmic deconstructions, runtime analysis, and time complexity reviews powered by private backend LLMs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Login / Enlistment CTA Section -->
      <section style="padding: 2rem 1.5rem 5rem; text-align: center;">
        <div class="container" style="max-width: 840px;">
          <div class="cyber-card" style="padding: 3rem 2rem; border: 1px solid rgba(0, 240, 255, 0.35); background: radial-gradient(circle at center, rgba(16, 24, 48, 0.95), rgba(7, 9, 19, 0.98)); box-shadow: 0 0 35px rgba(0, 240, 255, 0.15);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
            <h2 style="font-size: 2rem; margin-bottom: 0.75rem; color: #fff;">READY TO ASCEND THE RANKS?</h2>
            <p style="color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 2rem; max-width: 580px; margin-left: auto; margin-right: auto; line-height: 1.6;">
              Log in to sync your MMR ranking, unlock custom avatar skins, earn legendary achievement badges, and climb the esports leaderboard.
            </p>
            <div style="display: flex; gap: 1.25rem; justify-content: center; flex-wrap: wrap;">
              <button id="cta-login-btn" class="btn btn-cyber btn-lg">
                <span>🔐</span> LOGIN TO ARENA
              </button>
              <button id="cta-register-btn" class="btn btn-violet btn-lg">
                <span>⚔️</span> ENLIST NEW CALLSIGN
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  bindEvents() {
    document.getElementById('hero-play-btn')?.addEventListener('click', () => {
      router.navigate('matchmaking');
    });
    document.getElementById('hero-login-btn')?.addEventListener('click', () => {
      router.navigate('auth');
    });
    document.getElementById('hero-modes-btn')?.addEventListener('click', () => {
      router.navigate('modes');
    });
    document.getElementById('hero-boss-btn')?.addEventListener('click', () => {
      router.navigate('boss');
    });
    document.getElementById('cta-login-btn')?.addEventListener('click', () => {
      router.navigate('auth');
    });
    document.getElementById('cta-register-btn')?.addEventListener('click', () => {
      router.navigate('auth');
    });
  }
};
