/**
 * CodeRoyale — Settings & Notifications Controller
 */

import { sound } from '../sound.js';
import { Toast } from '../components/toast.js';
import { store } from '../state.js';

export const SettingsPage = {
  onEnter() {
    this.render();
    this.bindEvents();
  },

  render() {
    const settings = store.get('settings');
    const notifications = store.get('notifications') || [];
    const container = document.getElementById('settings-page');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="max-width: 860px; padding: 2.5rem 1.5rem 5rem;">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.2rem; margin-bottom: 0.25rem;">NEURAL TERMINAL CONFIGURATION</h1>
          <p style="color: var(--text-secondary);">Manage audio synthesizers, holographic display shaders, and system alerts.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 2rem;">
          <!-- System Notifications Drawer -->
          <div class="cyber-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.15rem; color: var(--neon-cyan); display: flex; align-items: center; gap: 0.5rem;">
                <span>🔔</span> QUANTUM NOTIFICATIONS
              </h3>
              <button id="clear-notifications-btn" class="btn btn-ghost btn-sm">Clear All</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${notifications.map(n => `
                <div style="background: rgba(10,14,26,0.7); border: 1px solid rgba(0,240,255,0.15); border-left: 3px solid var(--neon-cyan); border-radius: var(--border-radius-sm); padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem;">${n.title}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">${n.msg}</div>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${n.time}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Audio & Sound Synthesis -->
          <div class="cyber-card">
            <h3 style="font-size: 1.15rem; color: var(--neon-cyan); margin-bottom: 1.25rem;">AUDIO SYNTHESIS</h3>
            
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700;">Combat SFX Synthesizer</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">Procedural Web Audio laser, hit, and countdown cues</div>
              </div>
              <input type="checkbox" id="setting-sfx-toggle" ${settings.sfx ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
            </div>

            <div class="form-group">
              <label class="form-label">Sound Effects Volume</label>
              <input type="range" id="setting-sfx-volume" min="0" max="1" step="0.05" value="0.6" style="width: 100%;">
            </div>
          </div>

          <!-- Graphics & Visual Experience -->
          <div class="cyber-card">
            <h3 style="font-size: 1.15rem; color: var(--neon-cyan); margin-bottom: 1.25rem;">HOLOGRAPHIC SHADERS & PERFORMANCE</h3>

            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700;">Reduced Motion Mode</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">Disables particle canvas and fast screen transitions for accessibility</div>
              </div>
              <input type="checkbox" id="setting-motion-toggle" ${settings.reducedMotion ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
            </div>

            <div class="form-group">
              <label class="form-label">Monaco Editor Keybinding</label>
              <select id="setting-editor-keybinding" class="form-control" style="max-width: 300px;">
                <option value="standard" selected>Standard (VS Code default)</option>
                <option value="vim">Vim Emulation</option>
                <option value="emacs">Emacs Keybindings</option>
              </select>
            </div>
          </div>

          <!-- Save Button -->
          <button id="save-settings-btn" class="btn btn-cyber" style="align-self: flex-start;">
            <span>💾</span> SAVE CONFIGURATION
          </button>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('setting-sfx-toggle')?.addEventListener('change', (e) => {
      sound.toggleSound(e.target.checked);
    });

    document.getElementById('setting-sfx-volume')?.addEventListener('input', (e) => {
      sound.setVolume(parseFloat(e.target.value));
    });

    document.getElementById('clear-notifications-btn')?.addEventListener('click', () => {
      store.set('notifications', []);
      this.render();
      this.bindEvents();
      Toast.info('Notifications Cleared', 'All incoming alerts dismissed.');
    });

    document.getElementById('save-settings-btn')?.addEventListener('click', () => {
      const sfx = document.getElementById('setting-sfx-toggle')?.checked;
      const reducedMotion = document.getElementById('setting-motion-toggle')?.checked;
      const keybinding = document.getElementById('setting-editor-keybinding')?.value;

      store.update('settings', { sfx, reducedMotion, keybinding });
      Toast.success('Configuration Saved', 'Settings updated successfully.');
    });
  }
};
