/**
 * CodeRoyale — Real-time Multiplayer WebSocket & STOMP Client
 * Handles authenticated room subscriptions, matchmaking queues, and combat telemetry.
 * Includes a realistic in-browser opponent gladiator bot when running standalone.
 */

import { store } from './state.js';
import { sound } from './sound.js';

class MultiplayerClient {
  constructor() {
    this.wsUrl = window.WS_URL || 'ws://localhost:8080/ws';
    this.socket = null;
    this.stompClient = null;
    this.subscriptions = new Map();
    this.matchmakingTimer = null;
    this.opponentSimTimer = null;
  }

  connect() {
    const token = store.get('token');
    if (!token || !window.SockJS || !window.Stomp) {
      console.log('[Multiplayer] Running in Standalone Multiplayer Simulation Engine.');
      return;
    }

    try {
      const socket = new window.SockJS(this.wsUrl);
      this.stompClient = window.Stomp.over(socket);
      this.stompClient.debug = null; // Suppress noisy logs

      this.stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
        console.log('[Multiplayer] STOMP WebSocket connected successfully.');
        this.subscribeUserQueue();
      }, (err) => {
        console.warn('[Multiplayer] STOMP connection error, falling back to local engine:', err);
      });
    } catch (e) {
      console.warn('[Multiplayer] Fallback to simulation engine.');
    }
  }

  subscribeUserQueue() {
    if (!this.stompClient) return;
    const user = store.get('user');
    this.stompClient.subscribe(`/user/queue/match`, (message) => {
      const event = JSON.parse(message.body);
      this.handleSocketEvent(event);
    });
  }

  subscribeMatch(matchId, callback) {
    if (this.stompClient && this.stompClient.connected) {
      const sub = this.stompClient.subscribe(`/topic/match/${matchId}`, (msg) => {
        const payload = JSON.parse(msg.body);
        callback(payload);
      });
      this.subscriptions.set(`match_${matchId}`, sub);
    }
  }

  // Real-time Matchmaking Flow (1v1 Ranked / 2v2 Teams)
  startMatchmaking(gameMode = '1v1_ranked', onProgress, onMatchFound) {
    sound.playRadarPing();
    let secondsElapsed = 0;

    // Dispatch progress updates
    this.matchmakingTimer = setInterval(() => {
      secondsElapsed += 1;
      sound.playRadarPing();

      if (onProgress) {
        onProgress({
          elapsed: secondsElapsed,
          estimated: 8,
          status: 'Scanning global quantum sub-nodes...'
        });
      }

      // Simulate finding opponent between 3 - 6 seconds
      if (secondsElapsed >= 4) {
        clearInterval(this.matchmakingTimer);
        const opponent = this.generateOpponentGladiator();
        sound.playMatchFound();

        if (onMatchFound) {
          onMatchFound({
            matchId: 'match-' + Math.random().toString(36).substring(2, 9),
            mode: gameMode,
            opponent,
            durationSec: 180
          });
        }
      }
    }, 1000);
  }

  cancelMatchmaking() {
    if (this.matchmakingTimer) {
      clearInterval(this.matchmakingTimer);
      this.matchmakingTimer = null;
    }
  }

  generateOpponentGladiator() {
    const user = store.get('user');
    const opponents = [
      { username: 'QuantumGhost', title: 'Data Valkyrie', avatar: '⚡', mmr: user.mmr + 15, rank: user.rank },
      { username: 'ApexGlitch', title: 'Glitch Sorcerer', avatar: '👾', mmr: user.mmr - 10, rank: user.rank },
      { username: 'VortexCoder', title: 'Void Hunter', avatar: '🏹', mmr: user.mmr + 25, rank: user.rank },
      { username: 'CyberGiga', title: 'Code Titan', avatar: '🤖', mmr: user.mmr - 5, rank: user.rank }
    ];
    return opponents[Math.floor(Math.random() * opponents.length)];
  }

  // Start live opponent battle simulation (code updates, spell strikes, shield damage)
  startOpponentCombatSimulation(onOpponentUpdate) {
    let opponentHp = 100;
    let ticks = 0;

    this.opponentSimTimer = setInterval(() => {
      ticks += 1;

      // Opponent makes progress every 15-25 seconds
      if (ticks % 14 === 0) {
        const damageToPlayer = Math.floor(Math.random() * 25) + 15;
        sound.playShieldDamage();

        if (onOpponentUpdate) {
          onOpponentUpdate({
            event: 'OPPONENT_STRIKE',
            damageDealtToPlayer: damageToPlayer,
            opponentTestCasesPassed: Math.min(5, Math.floor(ticks / 14)),
            log: 'Opponent passed test cases and casted Quantum Nullify!'
          });
        }
      }
    }, 1000);
  }

  stopOpponentCombatSimulation() {
    if (this.opponentSimTimer) {
      clearInterval(this.opponentSimTimer);
      this.opponentSimTimer = null;
    }
  }

  // Room Management (Friend Rooms & Custom Arenas)
  createRoom(settings) {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const user = store.get('user');

    const room = {
      code: roomCode,
      name: settings.name || `${user.username}'s Arena`,
      host: user.username,
      mode: settings.mode || '1v1',
      difficulty: settings.difficulty || 'Medium',
      language: settings.language || 'Any',
      maxPlayers: settings.maxPlayers || 2,
      participants: [
        { ...user, isHost: true, isReady: true }
      ]
    };

    store.set('activeRoom', room);
    return room;
  }

  joinRoom(code) {
    const user = store.get('user');
    const existing = store.get('activeRoom');

    if (existing && existing.code === code) {
      return existing;
    }

    const room = {
      code: code.toUpperCase(),
      name: 'Cyber Combat Room ' + code.toUpperCase(),
      host: 'NeonOverlord',
      mode: '1v1',
      difficulty: 'Medium',
      language: 'Any',
      maxPlayers: 2,
      participants: [
        { username: 'NeonOverlord', avatar: '🧙‍♂️', rank: 'Platinum', isHost: true, isReady: true },
        { ...user, isHost: false, isReady: false }
      ]
    };

    store.set('activeRoom', room);
    return room;
  }
}

export const multiplayer = new MultiplayerClient();
