/**
 * CodeRoyale — Reusable Esports Top Navbar Component
 */

import { store } from '../state.js';
import { sound } from '../sound.js';
import { RankBadge } from './rankBadge.js';
import { router } from '../router.js';

export class NavbarComponent {
  static init() {
    this.render();
    this.bindEvents();
    store.subscribe('user', () => this.render());
  }

  static render() {
    const nav = document.getElementById('main-navbar');
    if (!nav) return;

    const user = store.get('user');
    const settings = store.get('settings');
    const rankObj = RankBadge.getRankData(user?.rank);
    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.username?.toLowerCase().includes('admin');

    nav.innerHTML = `
      <div class="nav-container" style="display: flex; align-items: center; justify-content: space-between; height: 100%; width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 1.5rem;">
        <!-- Left: Brand Logo -->
        <a href="#landing" class="nav-brand" style="display: flex; align-items: center; gap: 0.6rem; text-decoration: none; user-select: none;">
          <div style="font-size: 1.8rem; filter: drop-shadow(0 0 10px rgba(0,255,136,0.7)); animation: glowPulse 3s infinite;">⚔️</div>
          <div style="font-family: var(--font-display); font-weight: 800; font-style: normal; font-size: 1.25rem; letter-spacing: normal; color: #fff;">
            CODE <span class="gradient-text-cyan">QUEST</span>
          </div>
        </a>

        <!-- Center: Main Esports Navigation Links -->
        <div class="nav-links-desktop" style="display: flex; align-items: center; gap: 0.25rem;">
          <a href="#dashboard" class="nav-link">Dashboard</a>
          <a href="#modes" class="nav-link">Game Modes</a>
          <a href="#boss" class="nav-link">Boss Raids</a>
          <a href="#quest" class="nav-link">Quest Map</a>
          <a href="#aicoach" class="nav-link">AI Coach</a>
          <a href="#leaderboard" class="nav-link">Leaderboard</a>
          <a href="#auth" class="nav-link" id="nav-auth-link">Login</a>
          ${isAdmin ? `<a href="#admin" class="nav-link text-magenta">Admin</a>` : ''}
        </div>

        <!-- Right: Audio Toggle, Quick Play & User Profile Menu -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          <!-- SFX Toggle -->
          <button id="nav-sound-toggle" class="btn btn-ghost btn-sm" title="Toggle Sound Synthesis" style="padding: 0.4rem 0.6rem; font-size: 1.1rem;">
            ${sound.enabled ? '🔊' : '🔇'}
          </button>

          <!-- Quick Play CTA -->
          <a href="#matchmaking" class="btn btn-cyber btn-sm">
            <span>⚔️</span> PLAY NOW
          </a>

          <!-- Direct Login Button -->
          <a href="#auth" class="btn btn-ghost btn-sm" id="nav-direct-login-btn" title="Gladiator Authentication" style="border: 1px solid rgba(0, 240, 255, 0.35); color: var(--neon-cyan); padding: 0.4rem 0.8rem; font-size: 0.8rem;">
            <span>🔐</span> LOGIN
          </a>

          <!-- Profile Badge Dropdown -->
          <div class="nav-profile-pill" id="nav-profile-pill" style="display: flex; align-items: center; gap: 0.6rem; background: rgba(16,22,42,0.8); border: 1px solid rgba(0,240,255,0.25); border-radius: 999px; padding: 0.25rem 0.75rem 0.25rem 0.35rem; cursor: pointer; position: relative;">
            <div class="avatar-frame sm ${user?.rankId || 'gold'}">
              <div class="avatar-icon">${user?.avatar || '🥷'}</div>
            </div>
            <div style="display: flex; flex-direction: column; text-align: left;">
              <span style="font-size: 0.85rem; font-weight: 700; line-height: 1.1;">${user?.username || 'Gladiator'}</span>
              <span style="font-size: 0.7rem; color: var(--neon-cyan);">${user?.mmr || 1500} MMR</span>
            </div>

            <!-- Dropdown Menu -->
            <div id="profile-dropdown-menu" class="cyber-card" style="display: none; position: absolute; top: calc(100% + 10px); right: 0; width: 200px; padding: 0.75rem; box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 100;">
              <a href="#profile" class="dropdown-item" style="display: block; padding: 0.5rem; color: var(--text-primary); text-decoration: none; font-size: 0.9rem;">👤 My Profile</a>
              <a href="#settings" class="dropdown-item" style="display: block; padding: 0.5rem; color: var(--text-primary); text-decoration: none; font-size: 0.9rem;">⚙️ Settings</a>
              <a href="#auth" class="dropdown-item" style="display: block; padding: 0.5rem; color: var(--neon-magenta); text-decoration: none; font-size: 0.9rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 0.25rem;">🚪 Switch Callsign</a>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    const soundBtn = document.getElementById('nav-sound-toggle');
    soundBtn?.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      soundBtn.textContent = sound.enabled ? '🔊' : '🔇';
    });

    const pill = document.getElementById('nav-profile-pill');
    const dropdown = document.getElementById('profile-dropdown-menu');
    pill?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
      if (dropdown) dropdown.style.display = 'none';
    });
  }
}
