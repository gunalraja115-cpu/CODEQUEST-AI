/**
 * CodeRoyale — Player Onboarding Page Controller
 */

import { AVATARS } from '../mockData.js';
import { Toast } from '../components/toast.js';
import { router } from '../router.js';
import { store } from '../state.js';

export const OnboardingPage = {
  onEnter() {
    this.selectedAvatar = AVATARS[0];
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('onboarding-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="max-width: 820px; padding: 3rem 1.5rem;">
        <div class="holo-panel hud-corner">
          <div style="text-align: center; margin-bottom: 2.5rem;">
            <div class="badge badge-cyan" style="margin-bottom: 0.75rem;">GLADIATOR CALIBRATION</div>
            <h2 style="font-size: 2rem;">FORGE YOUR IDENTITY</h2>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">Select your combat avatar class and algorithmic proficiency level</p>
          </div>

          <form id="onboarding-form">
            <div class="form-group" style="margin-bottom: 2rem;">
              <label class="form-label">Battle Callsign</label>
              <input type="text" id="onboard-username" class="form-control" value="${store.get('user')?.username || 'CyberNinja'}" required>
            </div>

            <!-- Avatar Class Selector -->
            <div style="margin-bottom: 2rem;">
              <label class="form-label">Select Avatar Class</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
                ${AVATARS.map((av, idx) => `
                  <div class="cyber-card avatar-choice-card ${idx === 0 ? 'selected' : ''}" data-avatar-id="${av.id}" style="cursor: pointer; text-align: center; border-color: ${idx === 0 ? 'var(--neon-cyan)' : 'var(--bg-glass-border)'};">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${av.icon}</div>
                    <div class="font-display" style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem;">${av.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">${av.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Proficiency Level -->
            <div class="form-group" style="margin-bottom: 2.5rem;">
              <label class="form-label">Algorithmic Skill Level</label>
              <select id="onboard-level" class="form-control">
                <option value="Novice">Novice — Learning programming syntax & basics</option>
                <option value="Intermediate" selected>Intermediate — Solving LeetCode easy/medium problems</option>
                <option value="Advanced">Advanced — Competitive programming & complex graph/DP mastery</option>
              </select>
            </div>

            <button type="submit" class="btn btn-cyber btn-lg" style="width: 100%;">
              <span>🚀</span> COMPLETE CALIBRATION & ENTER ARENA
            </button>
          </form>
        </div>
      </div>
    `;
  },

  bindEvents() {
    const cards = document.querySelectorAll('.avatar-choice-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => {
          c.classList.remove('selected');
          c.style.borderColor = 'var(--bg-glass-border)';
        });
        card.classList.add('selected');
        card.style.borderColor = 'var(--neon-cyan)';
        const avId = card.getAttribute('data-avatar-id');
        this.selectedAvatar = AVATARS.find(a => a.id === avId) || AVATARS[0];
      });
    });

    document.getElementById('onboarding-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('onboard-username').value;
      const user = store.get('user');

      store.set('user', {
        ...user,
        username,
        avatar: this.selectedAvatar.icon,
        avatarClass: this.selectedAvatar.name
      });

      Toast.success('Gladiator Calibrated', 'Profile initialized. Welcome to Code Quest!');
      router.navigate('dashboard');
    });
  }
};
