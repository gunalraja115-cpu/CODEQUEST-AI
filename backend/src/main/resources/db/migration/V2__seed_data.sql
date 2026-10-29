-- =============================================================================
-- CodeRoyale Schema Migration V2: Seed Data (Ranks, Challenges, Quests, Admin)
-- =============================================================================

-- 1. Insert 8 Ranks (Bronze through Champion)
INSERT INTO ranks (id, name, tier_order, min_mmr, max_mmr, emblem_icon, accent_color) VALUES
('bronze', 'Bronze', 1, 0, 999, '🛡️', '#cd7f32'),
('silver', 'Silver', 2, 1000, 1399, '⚔️', '#c0c0c0'),
('gold', 'Gold', 3, 1400, 1799, '🔱', '#ffd700'),
('platinum', 'Platinum', 4, 1800, 2199, '💠', '#00f0ff'),
('diamond', 'Diamond', 5, 2200, 2599, '💎', '#b9f2ff'),
('master', 'Master', 6, 2600, 2999, '🔮', '#a855f7'),
('grandmaster', 'Grandmaster', 7, 3000, 3499, '⚡', '#ff007f'),
('champion', 'Champion', 8, 3500, 99999, '👑', '#ff6b00')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Core Challenges
INSERT INTO challenges (id, title, slug, difficulty, category, description, time_limit_ms, memory_limit_kb, xp_reward, starter_code_java, starter_code_python, starter_code_cpp) VALUES
('ch-01', 'Two Sum Nexus', 'two-sum-nexus', 'Easy', 'Arrays & Hashing',
'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
1500, 128000, 150,
'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write solution here\n        return new int[]{};\n    }\n}',
'class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write solution here\n        return []',
'#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write solution here\n        return {};\n    }\n};'),

('ch-02', 'Valid Syntax Shield', 'valid-syntax-shield', 'Easy', 'Stack & Strings',
'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.\n\nOpen brackets must be closed by the same type of brackets in the correct order.',
1200, 128000, 160,
'class Solution {\n    public boolean isValid(String s) {\n        // Write solution here\n        return false;\n    }\n}',
'class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write solution here\n        return False',
'#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write solution here\n        return false;\n    }\n};'),

('ch-03', 'Longest Cyber Streak', 'longest-cyber-streak', 'Medium', 'Sliding Window',
'Given a string s, find the length of the longest substring without repeating characters.',
1500, 128000, 300,
'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write solution here\n        return 0;\n    }\n}',
'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write solution here\n        return 0',
'#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write solution here\n        return 0;\n    }\n};'),

('ch-04', 'Quantum Grid Path', 'quantum-grid-path', 'Hard', 'Dynamic Programming',
'A cyber gladiator is located at the top-left corner of a m x n grid.\nThe gladiator can only move either down or right at any point in time to reach the bottom-right corner.\n\nCalculate the total number of unique valid paths.',
2000, 128000, 500,
'class Solution {\n    public int uniquePaths(int m, int n) {\n        // Write solution here\n        return 0;\n    }\n}',
'class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        # Write solution here\n        return 0',
'class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        // Write solution here\n        return 0;\n    }\n};')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 3. Insert Test Cases for Two Sum Nexus
INSERT INTO test_cases (id, challenge_id, input_data, expected_output, is_hidden, order_index) VALUES
('tc-01-1', 'ch-01', '[2, 7, 11, 15], 9', '[0, 1]', FALSE, 1),
('tc-01-2', 'ch-01', '[3, 2, 4], 6', '[1, 2]', FALSE, 2),
('tc-01-3', 'ch-01', '[3, 3], 6', '[0, 1]', FALSE, 3),
('tc-01-4', 'ch-01', '[1, 5, 8, 12, 19], 27', '[2, 4]', TRUE, 4),
('tc-01-5', 'ch-01', '[-1, -2, -3, -4, -5], -8', '[2, 4]', TRUE, 5)
ON DUPLICATE KEY UPDATE expected_output=VALUES(expected_output);

-- 4. Insert Test Cases for Valid Syntax Shield
INSERT INTO test_cases (id, challenge_id, input_data, expected_output, is_hidden, order_index) VALUES
('tc-02-1', 'ch-02', '"()"', 'true', FALSE, 1),
('tc-02-2', 'ch-02', '"()[]{}"', 'true', FALSE, 2),
('tc-02-3', 'ch-02', '"(]"', 'false', FALSE, 3),
('tc-02-4', 'ch-02', '"([{}])"', 'true', TRUE, 4),
('tc-02-5', 'ch-02', '"]"', 'false', TRUE, 5)
ON DUPLICATE KEY UPDATE expected_output=VALUES(expected_output);

-- 5. Insert Galactic Quest Map Nodes
INSERT INTO quest_nodes (id, node_order, title, category, icon, challenge_id, xp_reward) VALUES
('q-1', 1, 'Java Foundations', 'Basics', '☕', 'ch-01', 100),
('q-2', 2, 'Variables & Types', 'Basics', '📦', 'ch-01', 120),
('q-3', 3, 'Branching Logic', 'Control Flow', '🔀', 'ch-02', 150),
('q-4', 4, 'Iteration Loops', 'Control Flow', '🔄', 'ch-01', 180),
('q-5', 5, 'Linear Arrays', 'Data Structures', '📊', 'ch-01', 220),
('q-6', 6, 'String Manipulation', 'Strings', '🔤', 'ch-03', 260),
('q-7', 7, 'Binary Searching', 'Algorithms', '🔍', 'ch-01', 300),
('q-8', 8, 'Divide & Conquer', 'Algorithms', '⚔️', 'ch-03', 350),
('q-9', 9, 'Trees & Graphs', 'Advanced DSA', '🌳', 'ch-04', 450),
('q-10', 10, 'Dynamic Matrices', 'Dynamic Prog', '💎', 'ch-04', 600),
('q-11', 11, 'Final Boss Gate', 'Boss Raid', '👹', 'ch-04', 1500)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. Insert Achievements
INSERT INTO achievements (id, code, title, description, badge_icon, xp_bonus) VALUES
('ach-1', 'FIRST_BLOOD', 'First Blood', 'Win your first 1v1 ranked coding duel', '🗡️', 100),
('ach-2', 'BUG_SLAYER', 'Bug Slayer', 'Defeat the Bug Hunter boss entity', '👾', 300),
('ach-3', 'TITAN_CRUSHER', 'Titan Crusher', 'Optimize quadratic code to conquer Loop Titan', '🦾', 500),
('ach-4', 'STREAK_MASTER', 'Streak Master (5x)', 'Win 5 consecutive ranked matches', '🔥', 400),
('ach-5', 'GRANDMASTER_TIER', 'Grandmaster Ascension', 'Attain Grandmaster tier (3000+ MMR)', '⚡', 1000)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 7. Insert Default Seed Users
-- Password for both users is 'password123' hashed with BCrypt ($2a$10$wE9rJ4ZJ4ZJ4ZJ4ZJ4ZJ4uH/d2o0m9V8a7b6c5d4e3f2g1h0i.)
INSERT INTO users (id, username, email, password_hash, role) VALUES
('usr-admin-01', 'AdminOverlord', 'admin@coderoyale.io', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvReToTa', 'ROLE_ADMIN'),
('usr-demo-01', 'NeoGladiator', 'player@coderoyale.io', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvReToTa', 'ROLE_USER')
ON DUPLICATE KEY UPDATE role=VALUES(role);

INSERT INTO user_profiles (user_id, callsign, avatar_class, avatar_icon, skill_level, bio) VALUES
('usr-admin-01', 'AdminOverlord', 'Algorithm Overlord', '👑', 'Master', 'System Architect and Arena Governor.'),
('usr-demo-01', 'NeoGladiator', 'Cyber Shinobi', '🥷', 'Intermediate', 'Climbing the cyber ranks. Master of clean hash maps.')
ON DUPLICATE KEY UPDATE callsign=VALUES(callsign);

INSERT INTO user_ratings (user_id, mmr, current_rank_id, peak_mmr, wins, losses, current_streak, xp, player_level) VALUES
('usr-admin-01', 3600, 'champion', 3600, 150, 10, 8, 25000, 30),
('usr-demo-01', 1580, 'gold', 1620, 34, 12, 5, 4200, 14)
ON DUPLICATE KEY UPDATE mmr=VALUES(mmr);
