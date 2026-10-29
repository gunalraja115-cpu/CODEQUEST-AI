/**
 * CodeRoyale — Main Application Bootstrap
 * Registers all 16 page controllers, initializes background particles, audio engine, and router.
 */

import { router } from './router.js';
import { CyberParticles } from './particles.js';
import { NavbarComponent } from './components/navbar.js';
import { Modal } from './components/modal.js';
import { store } from './state.js';

// Import all 16 page controllers
import { LandingPage } from './pages/landing.js';
import { AuthPage } from './pages/auth.js';
import { OnboardingPage } from './pages/onboarding.js';
import { DashboardPage } from './pages/dashboard.js';
import { ModesPage } from './pages/modes.js';
import { MatchmakingPage } from './pages/matchmaking.js';
import { RoomsPage } from './pages/rooms.js';
import { ArenaPage } from './pages/arena.js';
import { BossPage } from './pages/boss.js';
import { QuestPage } from './pages/quest.js';
import { AiCoachPage } from './pages/aicoach.js';
import { LeaderboardPage } from './pages/leaderboard.js';
import { ResultsPage } from './pages/results.js';
import { ProfilePage } from './pages/profile.js';
import { SettingsPage } from './pages/settings.js';
import { AdminPage } from './pages/admin.js';

class CodeRoyaleApp {
  static init() {
    console.log('[CodeRoyale] Initializing Sci-Fi Esports Gaming Engine...');

    // Initialize Particle Canvas
    const settings = store.get('settings');
    if (!settings?.reducedMotion) {
      new CyberParticles('particle-canvas');
    }

    // Initialize Navbar
    NavbarComponent.init();

    // Bind generic modal dismissers
    Modal.bindDismissers();

    // Register all 16 routes
    router.register('landing', LandingPage);
    router.register('auth', AuthPage);
    router.register('login', AuthPage);
    router.register('onboarding', OnboardingPage);
    router.register('dashboard', DashboardPage);
    router.register('modes', ModesPage);
    router.register('matchmaking', MatchmakingPage);
    router.register('rooms', RoomsPage);
    router.register('arena', ArenaPage);
    router.register('boss', BossPage);
    router.register('quest', QuestPage);
    router.register('aicoach', AiCoachPage);
    router.register('leaderboard', LeaderboardPage);
    router.register('results', ResultsPage);
    router.register('profile', ProfilePage);
    router.register('settings', SettingsPage);
    router.register('admin', AdminPage);

    // Initial route dispatch
    router.handleRoute();

    console.log('[CodeRoyale] System Armed and Ready. All 16 Page Matrices Activated.');
  }
}

// Bootstrap once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  CodeRoyaleApp.init();
});
