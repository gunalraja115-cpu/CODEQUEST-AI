/**
 * CodeRoyale — Sci-Fi Cyber Esports Authentication Controller
 * Handles Gladiator Login, New Cadet Enlistment, Quick Pilot Presets, and Quantum Key Recovery.
 */

import { api } from '../api.js';
import { Toast } from '../components/toast.js';
import { router } from '../router.js';
import { store } from '../state.js';
import { sound } from '../sound.js';

export const AuthPage = {
  isRegisterMode: false,
  showPassword: false,

  onEnter(params) {
    // If param is register, enter in register mode
    if (params && params.get('mode') === 'register') {
      this.isRegisterMode = true;
    } else {
      this.isRegisterMode = false;
    }
    this.showPassword = false;
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('auth-page');
    if (!container) return;

    container.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-ambient-glow"></div>

        <div class="auth-card">
          <!-- Auth Terminal Header -->
          <div class="auth-header">
            <div class="auth-emblem">⚔️</div>
            <h1 class="auth-title" id="auth-title">
              ${this.isRegisterMode ? 'CADET ENLISTMENT' : 'GLADIATOR LOGIN'}
            </h1>
            <p class="auth-subtitle" id="auth-subtitle">
              ${this.isRegisterMode 
                ? 'Register your cyber combat signature to enter ranked battle' 
                : 'Authenticate your neural clearance key to enter the arena'}
            </p>
          </div>

          <!-- Mode Navigation Tabs -->
          <div class="auth-tabs-nav">
            <button type="button" class="auth-tab-btn ${!this.isRegisterMode ? 'active' : ''}" id="tab-login-btn">
              <span>⚡</span> SIGN IN
            </button>
            <button type="button" class="auth-tab-btn ${this.isRegisterMode ? 'active' : ''}" id="tab-register-btn">
              <span>🛡️</span> ENLIST NOW
            </button>
          </div>

          <!-- Credentials Form -->
          <form id="auth-form" autocomplete="on">
            <!-- Callsign / Username -->
            <div class="auth-field-group">
              <label class="auth-label" for="auth-username">
                <span>Callsign / Handle</span>
                <span style="font-size: 0.7rem; color: var(--neon-cyan);">REQUIRED</span>
              </label>
              <div class="auth-input-container">
                <input 
                  type="text" 
                  id="auth-username" 
                  class="auth-input" 
                  placeholder="e.g. NeoGladiator" 
                  required 
                  autocomplete="username"
                  autofocus
                >
                <span class="auth-input-icon">👤</span>
              </div>
            </div>

            <!-- Quantum Email (Register only) -->
            <div class="auth-field-group" id="email-group" style="${this.isRegisterMode ? 'display: block;' : 'display: none;'}">
              <label class="auth-label" for="auth-email">
                <span>Quantum Comms Email</span>
                <span style="font-size: 0.7rem; color: var(--neon-cyan);">ENCRYPTED</span>
              </label>
              <div class="auth-input-container">
                <input 
                  type="email" 
                  id="auth-email" 
                  class="auth-input" 
                  placeholder="gladiator@codequest.io"
                  autocomplete="email"
                >
                <span class="auth-input-icon">✉️</span>
              </div>
            </div>

            <!-- Security Key / Password -->
            <div class="auth-field-group">
              <label class="auth-label" for="auth-password">
                <span>Encryption Passkey</span>
                ${!this.isRegisterMode ? `<a href="javascript:void(0)" id="auth-forgot-link" style="color: var(--neon-cyan); text-decoration: none; font-size: 0.75rem; text-transform: none;">Forgot key?</a>` : ''}
              </label>
              <div class="auth-input-container">
                <input 
                  type="${this.showPassword ? 'text' : 'password'}" 
                  id="auth-password" 
                  class="auth-input" 
                  placeholder="••••••••••••" 
                  required
                  autocomplete="${this.isRegisterMode ? 'new-password' : 'current-password'}"
                >
                <span class="auth-input-icon">🔑</span>
                <button type="button" class="auth-password-toggle" id="auth-pwd-toggle" title="Toggle visibility">
                  ${this.showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <!-- Password Strength Gauge (Register Mode) -->
              <div id="password-strength-container" class="auth-strength-meter" style="${this.isRegisterMode ? 'display: block;' : 'display: none;'}">
                <div class="auth-strength-bar">
                  <div id="auth-strength-fill" class="auth-strength-fill"></div>
                </div>
                <div class="auth-strength-text">
                  <span id="auth-strength-label">Cipher Strength: Unchecked</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted);">Min 6 characters</span>
                </div>
              </div>
            </div>

            <!-- Remember Session -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 1.25rem 0 1.5rem; font-size: 0.85rem; color: var(--text-secondary);">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none;">
                <input type="checkbox" id="auth-remember" checked style="accent-color: var(--neon-cyan);"> Remember terminal session
              </label>
              <span style="font-size: 0.75rem; color: var(--neon-emerald); display: flex; align-items: center; gap: 0.3rem;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--neon-emerald); box-shadow: 0 0 6px var(--neon-emerald);"></span>
                Secure Nexus Link
              </span>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="auth-submit-btn" class="btn btn-cyber" style="width: 100%; padding: 0.9rem; font-size: 1rem; margin-bottom: 0.75rem;">
              <span>${this.isRegisterMode ? '⚔️' : '⚡'}</span> 
              <span id="auth-submit-text">${this.isRegisterMode ? 'INITIALIZE COMBAT PROFILE' : 'AUTHENTICATE & ENTER'}</span>
            </button>
          </form>

          <!-- Quick Test Pilot Presets -->
          <div class="auth-presets">
            <div class="auth-presets-title">
              <span>⚡ ONE-CLICK TEST PILOTS</span>
              <span style="color: var(--neon-gold); font-size: 0.7rem;">INSTANT DEMO</span>
            </div>
            <div class="auth-presets-grid">
              <!-- Preset 1: NeoGladiator -->
              <div class="auth-preset-chip" id="preset-gladiator" title="1-Click Login as NeoGladiator">
                <div class="auth-preset-badge">🥷</div>
                <div>
                  <div class="auth-preset-name">NeoGladiator</div>
                  <div class="auth-preset-meta">Gold II • 1,580 MMR</div>
                </div>
              </div>

              <!-- Preset 2: AdminOverlord -->
              <div class="auth-preset-chip" id="preset-admin" title="1-Click Login as Admin Overlord">
                <div class="auth-preset-badge">👑</div>
                <div>
                  <div class="auth-preset-name">AdminOverlord</div>
                  <div class="auth-preset-meta">Admin • 3,600 MMR</div>
                </div>
              </div>
            </div>

            <!-- Guest Sandbox Option -->
            <button type="button" id="auth-guest-btn" class="btn btn-ghost btn-sm" style="width: 100%; margin-top: 0.85rem; border: 1px dashed rgba(255, 255, 255, 0.15); color: var(--text-secondary); font-size: 0.8rem;">
              <span>🎮</span> Continue as Guest Cadet (Offline Simulator)
            </button>
          </div>

          <!-- Sci-Fi Feature Badges -->
          <div class="auth-features-row">
            <div class="auth-feature-pill">
              <span>🔒</span> 256-bit JWT
            </div>
            <div class="auth-feature-pill">
              <span>⚡</span> Real-time STOMP
            </div>
            <div class="auth-feature-pill">
              <span>🛡️</span> Zero Latency
            </div>
          </div>
        </div>
      </div>

      <!-- Quantum Access Key Recovery Modal -->
      <div id="recovery-modal" class="modal-overlay">
        <div class="modal-container" style="max-width: 440px;">
          <div class="modal-header">
            <div class="modal-title"><span>🔑</span> ACCESS KEY RECOVERY</div>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem; line-height: 1.5;">
              Transmit your registered quantum communications email to receive an encrypted reset token.
            </p>
            <div class="auth-field-group">
              <label class="auth-label">Registered Email</label>
              <div class="auth-input-container">
                <input type="email" id="recovery-email" class="auth-input" placeholder="gladiator@codequest.io">
                <span class="auth-input-icon">✉️</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" id="recovery-cancel-btn">Abort</button>
            <button type="button" id="recovery-send-btn" class="btn btn-cyber">Transmit Key</button>
          </div>
        </div>
      </div>
    `;
  },

  setMode(isRegister) {
    this.isRegisterMode = isRegister;
    sound.playClick();
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    const form = document.getElementById('auth-form');
    const tabLogin = document.getElementById('tab-login-btn');
    const tabRegister = document.getElementById('tab-register-btn');
    const pwdToggle = document.getElementById('auth-pwd-toggle');
    const pwdInput = document.getElementById('auth-password');
    const forgotLink = document.getElementById('auth-forgot-link');
    const recoveryModal = document.getElementById('recovery-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const recoveryCancel = document.getElementById('recovery-cancel-btn');
    const recoverySend = document.getElementById('recovery-send-btn');
    const presetGladiator = document.getElementById('preset-gladiator');
    const presetAdmin = document.getElementById('preset-admin');
    const guestBtn = document.getElementById('auth-guest-btn');

    // Tab buttons
    tabLogin?.addEventListener('click', () => this.setMode(false));
    tabRegister?.addEventListener('click', () => this.setMode(true));

    // Show/hide password
    pwdToggle?.addEventListener('click', () => {
      this.showPassword = !this.showPassword;
      if (pwdInput) {
        pwdInput.type = this.showPassword ? 'text' : 'password';
        pwdToggle.textContent = this.showPassword ? '🙈' : '👁️';
      }
    });

    // Password strength check
    pwdInput?.addEventListener('input', (e) => {
      const val = e.target.value;
      const fill = document.getElementById('auth-strength-fill');
      const label = document.getElementById('auth-strength-label');
      if (!fill || !label) return;

      if (!val) {
        fill.className = 'auth-strength-fill';
        fill.style.width = '0%';
        label.textContent = 'Cipher Strength: Unchecked';
      } else if (val.length < 6) {
        fill.className = 'auth-strength-fill weak';
        label.textContent = 'Cipher Strength: Vulnerable';
      } else if (val.length < 9) {
        fill.className = 'auth-strength-fill medium';
        label.textContent = 'Cipher Strength: Tactical';
      } else {
        fill.className = 'auth-strength-fill strong';
        label.textContent = 'Cipher Strength: Cyber-Fortified';
      }
    });

    // 1-Click Preset Pilots
    presetGladiator?.addEventListener('click', async () => {
      sound.playClick();
      const usernameInput = document.getElementById('auth-username');
      const pwdInput = document.getElementById('auth-password');
      if (usernameInput) usernameInput.value = 'NeoGladiator';
      if (pwdInput) pwdInput.value = 'password123';
      Toast.info('Gladiator Preset Selected', 'Authenticating NeoGladiator...');
      try {
        await api.login('NeoGladiator', 'password123');
        sound.playVictory();
        Toast.success('Clearance Granted', 'Welcome back, NeoGladiator! Nexus connected.');
        router.navigate('dashboard');
      } catch (err) {
        Toast.error('Auth Failed', err.message);
      }
    });

    presetAdmin?.addEventListener('click', async () => {
      sound.playClick();
      const usernameInput = document.getElementById('auth-username');
      const pwdInput = document.getElementById('auth-password');
      if (usernameInput) usernameInput.value = 'AdminOverlord';
      if (pwdInput) pwdInput.value = 'password123';
      Toast.info('Admin Overlord Clearance', 'Granting administrative terminal rights...');
      try {
        await api.login('AdminOverlord', 'password123');
        sound.playVictory();
        Toast.success('Admin Override Accepted', 'Welcome Governor AdminOverlord!');
        router.navigate('admin');
      } catch (err) {
        Toast.error('Auth Failed', err.message);
      }
    });

    guestBtn?.addEventListener('click', () => {
      sound.playClick();
      const guestUser = {
        id: 'usr-guest-' + Math.floor(Math.random() * 9000 + 1000),
        username: 'GuestCadet',
        role: 'ROLE_USER',
        rank: 'Bronze',
        mmr: 1000,
        avatar: '🛡️',
        wins: 0,
        losses: 0,
        level: 1,
        xp: 0,
        xpToNextLevel: 500
      };
      store.set('user', guestUser);
      store.set('token', 'guest_token_' + Date.now());
      Toast.success('Guest Simulator Active', 'Offline mode enabled. Climb the ranks to save stats permanent!');
      router.navigate('dashboard');
    });

    // Forgot password modal
    forgotLink?.addEventListener('click', () => {
      sound.playClick();
      recoveryModal?.classList.add('open');
    });

    const closeModal = () => recoveryModal?.classList.remove('open');
    modalClose?.addEventListener('click', closeModal);
    recoveryCancel?.addEventListener('click', closeModal);

    recoverySend?.addEventListener('click', () => {
      const email = document.getElementById('recovery-email')?.value;
      if (!email || !email.includes('@')) {
        Toast.error('Invalid Comms Address', 'Please provide a valid quantum email address.');
        return;
      }
      closeModal();
      sound.playClick();
      Toast.success('Quantum Transmission Sent', `Encrypted recovery token beamed to ${email}.`);
    });

    // Form submission
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('auth-username')?.value.trim();
      const password = document.getElementById('auth-password')?.value;
      const email = document.getElementById('auth-email')?.value.trim();

      if (!username || !password) {
        Toast.error('Credentials Incomplete', 'Callsign and encryption passkey are required.');
        return;
      }

      const submitBtn = document.getElementById('auth-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>⏳</span> TRANSMITTING...`;
      }

      try {
        if (this.isRegisterMode) {
          await api.register(username, email, password);
          sound.playVictory();
          Toast.success('Enlistment Complete', `Welcome to Code Quest, ${username}! Proceeding to onboarding...`);
          router.navigate('onboarding');
        } else {
          await api.login(username, password);
          sound.playVictory();
          Toast.success('Clearance Granted', `Welcome back, ${username}!`);
          router.navigate('dashboard');
        }
      } catch (err) {
        sound.playDefeat();
        Toast.error('Authentication Error', err.message || 'Verification failed');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>${this.isRegisterMode ? '⚔️' : '⚡'}</span> <span>${this.isRegisterMode ? 'INITIALIZE COMBAT PROFILE' : 'AUTHENTICATE & ENTER'}</span>`;
        }
      }
    });
  }
};
