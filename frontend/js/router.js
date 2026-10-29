/**
 * CodeRoyale — Client-Side Hash Router
 * Manages view routing across all 16 pages with navigation guards and lifecycle hooks.
 */

import { sound } from './sound.js';
import { store } from './state.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.init();
  }

  register(path, handler) {
    this.routes.set(path, handler);
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  navigate(path) {
    sound.playClick();
    window.location.hash = path;
  }

  handleRoute() {
    let hash = window.location.hash.slice(1) || 'landing';
    const [rawPath, queryString] = hash.split('?');
    const path = rawPath === 'login' ? 'auth' : rawPath;
    const params = new URLSearchParams(queryString || '');

    // Auth check if onboarding is needed
    const user = store.get('user');
    if (!user && path !== 'landing' && path !== 'auth') {
      this.navigate('auth');
      return;
    }

    const handler = this.routes.get(path) || this.routes.get(rawPath) || this.routes.get('landing');

    if (this.currentRoute && this.currentRoute.onLeave) {
      this.currentRoute.onLeave();
    }

    // Hide all page containers
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show targeted container
    const targetEl = document.getElementById(`${path}-page`);
    if (targetEl) {
      targetEl.classList.add('active');
      window.scrollTo(0, 0);
    }

    // Update active navbar item
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${path}` || (path === 'auth' && (href === '#login' || href === '#auth'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (handler && handler.onEnter) {
      handler.onEnter(params);
    }

    this.currentRoute = handler;
  }
}

export const router = new Router();
