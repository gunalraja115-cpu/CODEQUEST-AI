/**
 * CodeRoyale — Mock Data & Game Catalog
 * Authoritative seed catalog for ranks, challenges, bosses, avatars, and quest tree.
 */

export const RANKS = [
  { id: 'bronze', name: 'Bronze', minMmr: 0, maxMmr: 999, color: '#cd7f32', emblem: '🛡️', tier: 'Beginner' },
  { id: 'silver', name: 'Silver', minMmr: 1000, maxMmr: 1399, color: '#c0c0c0', emblem: '⚔️', tier: 'Developing' },
  { id: 'gold', name: 'Gold', minMmr: 1400, maxMmr: 1799, color: '#ffd700', emblem: '🔱', tier: 'Adept' },
  { id: 'platinum', name: 'Platinum', minMmr: 1800, maxMmr: 2199, color: '#00f0ff', emblem: '💠', tier: 'Skilled' },
  { id: 'diamond', name: 'Diamond', minMmr: 2200, maxMmr: 2599, color: '#b9f2ff', emblem: '💎', tier: 'Mastery' },
  { id: 'master', name: 'Master', minMmr: 2600, maxMmr: 2999, color: '#a855f7', emblem: '🔮', tier: 'Expert' },
  { id: 'grandmaster', name: 'Grandmaster', minMmr: 3000, maxMmr: 3499, color: '#ff007f', emblem: '⚡', tier: 'Elite' },
  { id: 'champion', name: 'Champion', minMmr: 3500, maxMmr: 99999, color: '#ff6b00', emblem: '👑', tier: 'Legendary' }
];

export const AVATARS = [
  { id: 'shinobi', name: 'Cyber Shinobi', icon: '🥷', desc: 'Speed and agile recursion specialist', color: '#00f0ff' },
  { id: 'mage', name: 'Neon Mage', icon: '🧙‍♂️', desc: 'Master of functional paradigms and transformations', color: '#a855f7' },
  { id: 'hunter', name: 'Void Hunter', icon: '🏹', desc: 'Critical strike edge-case hunter', color: '#ff007f' },
  { id: 'titan', name: 'Code Titan', icon: '🤖', desc: 'Impenetrable memory and thread-safe architecture', color: '#ffd700' },
  { id: 'valkyrie', name: 'Data Valkyrie', icon: '⚡', desc: 'Lightning-fast binary search and graph traversal', color: '#00f59b' },
  { id: 'sorcerer', name: 'Glitch Sorcerer', icon: '👾', desc: 'Bitwise manipulator who bends system rules', color: '#ff6b00' }
];

export const CHALLENGES = [
  {
    id: 'ch-01',
    title: 'Two Sum Nexus',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    xpReward: 150,
    timeLimitMs: 1500,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 6.' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        return []`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`
    },
    testCases: [
      { id: 'tc-1', input: '[2,7,11,15], 9', expected: '[0, 1]', hidden: false },
      { id: 'tc-2', input: '[3,2,4], 6', expected: '[1, 2]', hidden: false },
      { id: 'tc-3', input: '[3,3], 6', expected: '[0, 1]', hidden: false },
      { id: 'tc-4', input: '[1,5,8,12,19], 27', expected: '[2, 4]', hidden: true },
      { id: 'tc-5', input: '[-1,-2,-3,-4,-5], -8', expected: '[2, 4]', hidden: true }
    ]
  },
  {
    id: 'ch-02',
    title: 'Valid Syntax Shield',
    difficulty: 'Easy',
    category: 'Stack & Strings',
    xpReward: 160,
    timeLimitMs: 1200,
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'Matching pair.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All pairs properly closed.' },
      { input: 's = "(]"', output: 'false', explanation: 'Mismatched closing bracket.' }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    starterCode: {
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        return False`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        return false;
    }
};`
    },
    testCases: [
      { id: 'tc-1', input: '"()"', expected: 'true', hidden: false },
      { id: 'tc-2', input: '"()[]{}"', expected: 'true', hidden: false },
      { id: 'tc-3', input: '"(]"', expected: 'false', hidden: false },
      { id: 'tc-4', input: '"([{}])"', expected: 'true', hidden: true },
      { id: 'tc-5', input: '"]"', expected: 'false', hidden: true }
    ]
  },
  {
    id: 'ch-03',
    title: 'Longest Cyber Streak',
    difficulty: 'Medium',
    category: 'Sliding Window',
    xpReward: 300,
    timeLimitMs: 1500,
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with length of 1.' }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: {
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your solution here
        return 0`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here
        return 0;
    }
};`
    },
    testCases: [
      { id: 'tc-1', input: '"abcabcbb"', expected: '3', hidden: false },
      { id: 'tc-2', input: '"bbbbb"', expected: '1', hidden: false },
      { id: 'tc-3', input: '"pwwkew"', expected: '3', hidden: false },
      { id: 'tc-4', input: '""', expected: '0', hidden: true },
      { id: 'tc-5', input: '"coderoyale"', expected: '7', hidden: true }
    ]
  },
  {
    id: 'ch-04',
    title: 'Quantum Grid Path',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    xpReward: 500,
    timeLimitMs: 2000,
    description: `A cyber gladiator is located at the top-left corner of a \`m x n\` grid.
The robot can only move either down or right at any point in time. The gladiator is trying to reach the bottom-right corner of the grid.

How many possible unique paths are there?`,
    examples: [
      { input: 'm = 3, n = 7', output: '28', explanation: '28 unique paths from start to finish.' },
      { input: 'm = 3, n = 2', output: '3', explanation: '3 unique paths.' }
    ],
    constraints: [
      '1 <= m, n <= 100'
    ],
    starterCode: {
      java: `class Solution {
    public int uniquePaths(int m, int n) {
        // Write your solution here
        return 0;
    }
}`,
      python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        # Write your solution here
        return 0`,
      cpp: `class Solution {
public:
    int uniquePaths(int m, int n) {
        // Write your solution here
        return 0;
    }
};`
    },
    testCases: [
      { id: 'tc-1', input: '3, 7', expected: '28', hidden: false },
      { id: 'tc-2', input: '3, 2', expected: '3', hidden: false },
      { id: 'tc-3', input: '7, 3', expected: '28', hidden: false },
      { id: 'tc-4', input: '1, 1', expected: '1', hidden: true },
      { id: 'tc-5', input: '10, 10', expected: '48620', hidden: true }
    ]
  }
];

export const BOSSES = [
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    title: 'The Edge-Case Corruptor',
    classKey: 'bug-hunter',
    avatar: '👾',
    quote: '"Your null pointers and off-by-one errors feed my digital abyss!"',
    totalHp: 1000,
    currentHp: 1000,
    difficulty: 'Hard',
    stages: 3,
    rewardXp: 800,
    rewardBadge: 'Bug Exterminator',
    description: 'A rogue cyber parasitic entity that injects memory leaks, dangling pointers, and boundary bugs into the arena codebase. Fix the anomalies to tear through its defensive layers.',
    challengeId: 'ch-02'
  },
  {
    id: 'loop-titan',
    name: 'Loop Titan',
    title: 'Colossus of Quadratic Time',
    classKey: 'loop-titan',
    avatar: '🦾',
    quote: '"Feel the crushing weight of O(N^3) nested iterations!"',
    totalHp: 1500,
    currentHp: 1500,
    difficulty: 'Hard',
    stages: 3,
    rewardXp: 1200,
    rewardBadge: 'Titan Slayer',
    description: 'An ancient automated behemoth running infinite nested loops. Optimize the algorithms to O(N) or O(N log N) to deplete its energy cores.',
    challengeId: 'ch-01'
  },
  {
    id: 'array-beast',
    name: 'Array Beast',
    title: 'The Multi-Dimensional Devourer',
    classKey: 'array-beast',
    avatar: '🐉',
    quote: '"Your contiguous memory will be fractured into void fragments!"',
    totalHp: 2000,
    currentHp: 2000,
    difficulty: 'Master',
    stages: 4,
    rewardXp: 1800,
    rewardBadge: 'Matrix Conqueror',
    description: 'A terrifying serpentine leviathan that twists matrices and multi-dimensional memory buffers. Slay it using sliding window and two-pointer maneuvers.',
    challengeId: 'ch-03'
  },
  {
    id: 'logic-phantom',
    name: 'Logic Phantom',
    title: 'Ghost of the Boolean Matrix',
    classKey: 'logic-phantom',
    avatar: '👻',
    quote: '"True is False, 0 is 1. Can your mind navigate my inverted gates?"',
    totalHp: 2500,
    currentHp: 2500,
    difficulty: 'Grandmaster',
    stages: 4,
    rewardXp: 2500,
    rewardBadge: 'Logic Weaver',
    description: 'An ethereal specter shifting between binary states and bitwise paradoxes. Break its illusions with bit manipulation and boolean proofs.',
    challengeId: 'ch-02'
  },
  {
    id: 'algorithm-overlord',
    name: 'Algorithm Overlord',
    title: 'Sovereign of Dynamic Worlds',
    classKey: 'algorithm-overlord',
    avatar: '👑',
    quote: '"Behold optimal substructure perfection. You cannot out-calculate eternity!"',
    totalHp: 4000,
    currentHp: 4000,
    difficulty: 'Champion',
    stages: 5,
    rewardXp: 5000,
    rewardBadge: 'Grand Sovereign',
    description: 'The supreme intelligence governing CodeRoyale. Only those who master dynamic programming, topological graph ordering, and memoization can dethrone it.',
    challengeId: 'ch-04'
  }
];

export const QUEST_NODES = [
  { id: 'q-1', title: 'Java Foundations', category: 'Basics', icon: '☕', status: 'completed', stars: 3, xp: 100, challengeId: 'ch-01' },
  { id: 'q-2', title: 'Variables & Types', category: 'Basics', icon: '📦', status: 'completed', stars: 3, xp: 120, challengeId: 'ch-01' },
  { id: 'q-3', title: 'Branching Logic', category: 'Control Flow', icon: '🔀', status: 'completed', stars: 2, xp: 150, challengeId: 'ch-02' },
  { id: 'q-4', title: 'Iteration Loops', category: 'Control Flow', icon: '🔄', status: 'current', stars: 0, xp: 180, challengeId: 'ch-01' },
  { id: 'q-5', title: 'Linear Arrays', category: 'Data Structures', icon: '📊', status: 'locked', stars: 0, xp: 220, challengeId: 'ch-01' },
  { id: 'q-6', title: 'String Manipulation', category: 'Strings', icon: '🔤', status: 'locked', stars: 0, xp: 260, challengeId: 'ch-03' },
  { id: 'q-7', title: 'Binary Searching', category: 'Algorithms', icon: '🔍', status: 'locked', stars: 0, xp: 300, challengeId: 'ch-01' },
  { id: 'q-8', title: 'Divide & Conquer', category: 'Algorithms', icon: '⚔️', status: 'locked', stars: 0, xp: 350, challengeId: 'ch-03' },
  { id: 'q-9', title: 'Trees & Graphs', category: 'Advanced DSA', icon: '🌳', status: 'locked', stars: 0, xp: 450, challengeId: 'ch-04' },
  { id: 'q-10', title: 'Dynamic Matrices', category: 'Dynamic Prog', icon: '💎', status: 'locked', stars: 0, xp: 600, challengeId: 'ch-04' },
  { id: 'q-11', title: 'Final Boss Gate', category: 'Boss Raid', icon: '👹', status: 'boss-gate', stars: 0, xp: 1500, challengeId: 'ch-04' }
];

export const DAILY_QUESTS = [
  { id: 'dq-1', title: 'Solve 2 Array Battles', progress: 1, total: 2, rewardXp: 200, rewardGold: 50, completed: false },
  { id: 'dq-2', title: 'Defeat 1 Boss Stage', progress: 0, total: 1, rewardXp: 350, rewardGold: 100, completed: false },
  { id: 'dq-3', title: 'Win a Ranked 1v1 Battle', progress: 1, total: 1, rewardXp: 300, rewardGold: 75, completed: true }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, username: 'ZeroCool', title: 'Grand Sovereign', avatar: '🥷', mmr: 3840, rankTier: 'champion', wins: 284, losses: 38, winRate: 88, lang: 'Java' },
  { rank: 2, username: 'ByteSurgeon', title: 'Algorithm Overlord', avatar: '🧙‍♂️', mmr: 3620, rankTier: 'champion', wins: 251, losses: 44, winRate: 85, lang: 'C++' },
  { rank: 3, username: 'CyberValkyrie', title: 'Data Valkyrie', avatar: '⚡', mmr: 3490, rankTier: 'grandmaster', wins: 219, losses: 52, winRate: 81, lang: 'Python' },
  { rank: 4, username: 'NeonMatrix', title: 'Glitch Sorcerer', avatar: '👾', mmr: 3210, rankTier: 'grandmaster', wins: 198, losses: 61, winRate: 76, lang: 'Java' },
  { rank: 5, username: 'PixelKnight', title: 'Code Titan', avatar: '🤖', mmr: 2980, rankTier: 'master', wins: 180, losses: 65, winRate: 73, lang: 'C++' },
  { rank: 6, username: 'CodeNinjaX', title: 'Void Hunter', avatar: '🏹', mmr: 2850, rankTier: 'master', wins: 165, losses: 70, winRate: 70, lang: 'Python' },
  { rank: 7, username: 'SyntaxGod', title: 'Master of Loops', avatar: '🥷', mmr: 2710, rankTier: 'master', wins: 154, losses: 72, winRate: 68, lang: 'Java' },
  { rank: 8, username: 'RecursionPro', title: 'Diamond Gladiator', avatar: '🧙‍♂️', mmr: 2490, rankTier: 'diamond', wins: 140, losses: 78, winRate: 64, lang: 'Python' }
];

export const INITIAL_USER = {
  id: 'usr-guest-001',
  username: 'NeoGladiator',
  avatar: '🥷',
  avatarClass: 'Cyber Shinobi',
  rank: 'Gold',
  rankId: 'gold',
  mmr: 1580,
  xp: 4200,
  xpToNextLevel: 5000,
  level: 14,
  coins: 850,
  wins: 34,
  losses: 12,
  winRate: 74,
  streak: 5,
  bio: 'Climbing the cyber ranks. Master of clean hash maps and sliding windows.',
  role: 'ROLE_USER',
  badges: ['First Blood', 'Bug Slayer', 'Streak Master (5x)', 'Array Novice']
};
