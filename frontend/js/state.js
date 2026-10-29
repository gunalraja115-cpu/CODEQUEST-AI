/**
 * CodeRoyale — Global State Management
 * Reactive state store with listener subscribers and localStorage persistence.
 */

import { INITIAL_USER, RANKS, QUEST_NODES, DAILY_QUESTS, CHALLENGES } from './mockData.js';

class StateStore {
  constructor() {
    this.listeners = new Map();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const savedUser = localStorage.getItem('coderoyale_user');
    const savedToken = localStorage.getItem('coderoyale_token');
    const savedSettings = localStorage.getItem('coderoyale_settings');

    let settings = {
      sfx: true,
      music: false,
      reducedMotion: false,
      theme: 'cyber-dark',
      keybinding: 'standard'
    };

    if (savedSettings) {
      try { settings = { ...settings, ...JSON.parse(savedSettings) }; } catch (e) {}
    }

    return {
      user: savedUser ? JSON.parse(savedUser) : { ...INITIAL_USER },
      token: savedToken || null,
      isAuthenticated: !!savedToken || true, // Defaults to authenticated guest in demo mode
      isLiveBackend: false, // Toggled to true when Spring Boot responds
      settings,
      activeMatch: null,
      activeRoom: null,
      currentChallenge: CHALLENGES[0],
      activeBoss: null,
      questNodes: [...QUEST_NODES],
      dailyQuests: [...DAILY_QUESTS],
      notifications: [
        { id: 1, title: 'Season 4 Live', msg: 'Ranked ladders are reset. Climb to Champion tier for legendary rewards!', time: '10m ago', unread: true },
        { id: 2, title: 'Daily Quests Ready', msg: 'New coding bounties available in the Quest terminal.', time: '1h ago', unread: true }
      ]
    };
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;

    if (key === 'user') {
      localStorage.setItem('coderoyale_user', JSON.stringify(value));
    } else if (key === 'token') {
      if (value) localStorage.setItem('coderoyale_token', value);
      else localStorage.removeItem('coderoyale_token');
    } else if (key === 'settings') {
      localStorage.setItem('coderoyale_settings', JSON.stringify(value));
    }

    this.notify(key, value);
  }

  update(key, partialUpdate) {
    const current = this.state[key];
    const updated = typeof partialUpdate === 'function' ? partialUpdate(current) : { ...current, ...partialUpdate };
    this.set(key, updated);
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }

  notify(key, value) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => cb(value, this.state));
    }
    // Also notify global wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb(key, value, this.state));
    }
  }

  // Combat rating helpers
  addXP(amount) {
    const user = { ...this.state.user };
    user.xp += amount;
    if (user.xp >= user.xpToNextLevel) {
      user.level += 1;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.35);
    }
    this.set('user', user);
  }

  updateMmr(delta) {
    const user = { ...this.state.user };
    user.mmr = Math.max(0, user.mmr + delta);

    // Calculate rank tier based on MMR
    const rankObj = RANKS.find(r => user.mmr >= r.minMmr && user.mmr <= r.maxMmr) || RANKS[0];
    user.rank = rankObj.name;
    user.rankId = rankObj.id;

    if (delta > 0) user.wins += 1;
    else user.losses += 1;

    const totalMatches = user.wins + user.losses;
    user.winRate = totalMatches > 0 ? Math.round((user.wins / totalMatches) * 100) : 0;

    this.set('user', user);
    return rankObj;
  }
}

export const store = new StateStore();
