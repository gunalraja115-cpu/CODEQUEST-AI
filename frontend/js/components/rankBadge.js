/**
 * CodeRoyale — Rank Badge & Visual Emblem Renderer
 */

import { RANKS } from '../mockData.js';

export class RankBadge {
  static getRankData(rankNameOrId) {
    if (!rankNameOrId) return RANKS[0];
    const key = rankNameOrId.toLowerCase();
    return RANKS.find(r => r.name.toLowerCase() === key || r.id.toLowerCase() === key) || RANKS[0];
  }

  static renderBadge(rankNameOrId, showLabel = true) {
    const rank = this.getRankData(rankNameOrId);
    return `
      <div class="badge" style="background: ${rank.color}22; border-color: ${rank.color}; color: ${rank.color};">
        <span>${rank.emblem}</span>
        ${showLabel ? `<span>${rank.name}</span>` : ''}
      </div>
    `;
  }

  static renderEmblem(rankNameOrId, size = 'md') {
    const rank = this.getRankData(rankNameOrId);
    return `
      <div class="rank-emblem rank-${rank.id} size-${size}" style="color: ${rank.color}; filter: drop-shadow(0 0 10px ${rank.color}88);">
        <span class="emblem-glyph">${rank.emblem}</span>
      </div>
    `;
  }
}
