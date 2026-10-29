-- =============================================================================
-- CodeRoyale Schema Migration V1: Database Tables & Constraints
-- =============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email)
);

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id VARCHAR(36) PRIMARY KEY,
    callsign VARCHAR(50) NOT NULL,
    avatar_class VARCHAR(50) DEFAULT 'Cyber Shinobi',
    avatar_icon VARCHAR(10) DEFAULT '🥷',
    skill_level VARCHAR(20) DEFAULT 'Intermediate',
    bio TEXT,
    coins INT DEFAULT 500,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Ranks Table
CREATE TABLE IF NOT EXISTS ranks (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    tier_order INT NOT NULL UNIQUE,
    min_mmr INT NOT NULL,
    max_mmr INT NOT NULL,
    emblem_icon VARCHAR(10) NOT NULL,
    accent_color VARCHAR(10) NOT NULL
);

-- 4. User Ratings Table
CREATE TABLE IF NOT EXISTS user_ratings (
    user_id VARCHAR(36) PRIMARY KEY,
    mmr INT NOT NULL DEFAULT 1200,
    current_rank_id VARCHAR(20) NOT NULL DEFAULT 'silver',
    peak_mmr INT NOT NULL DEFAULT 1200,
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0,
    draws INT NOT NULL DEFAULT 0,
    current_streak INT NOT NULL DEFAULT 0,
    best_streak INT NOT NULL DEFAULT 0,
    xp INT NOT NULL DEFAULT 0,
    player_level INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_rank_id) REFERENCES ranks(id),
    INDEX idx_ratings_mmr (mmr DESC)
);

-- 5. Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    difficulty VARCHAR(20) NOT NULL, -- Easy, Medium, Hard, Master, Champion
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    time_limit_ms INT NOT NULL DEFAULT 2000,
    memory_limit_kb INT NOT NULL DEFAULT 128000,
    xp_reward INT NOT NULL DEFAULT 200,
    starter_code_java TEXT,
    starter_code_python TEXT,
    starter_code_cpp TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_challenge_diff (difficulty),
    INDEX idx_challenge_cat (category)
);

-- 6. Test Cases Table
CREATE TABLE IF NOT EXISTS test_cases (
    id VARCHAR(36) PRIMARY KEY,
    challenge_id VARCHAR(36) NOT NULL,
    input_data TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    explanation TEXT,
    order_index INT NOT NULL DEFAULT 0,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    INDEX idx_tc_challenge (challenge_id)
);

-- 7. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    challenge_id VARCHAR(36) NOT NULL,
    match_id VARCHAR(36),
    language VARCHAR(20) NOT NULL, -- java, python, cpp
    code TEXT NOT NULL,
    status VARCHAR(30) NOT NULL, -- ACCEPTED, WRONG_ANSWER, TLE, COMPILATION_ERROR, RUNTIME_ERROR
    passed_test_cases INT NOT NULL DEFAULT 0,
    total_test_cases INT NOT NULL DEFAULT 0,
    execution_time_ms INT,
    memory_kb INT,
    compile_output TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    INDEX idx_sub_user (user_id),
    INDEX idx_sub_challenge (challenge_id),
    INDEX idx_sub_match (match_id)
);

-- 8. Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(36) PRIMARY KEY,
    mode VARCHAR(30) NOT NULL, -- RANKED_1V1, FRIEND_ROOM, TEAM_2V2, BOSS_RAID, PRACTICE
    challenge_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL, -- WAITING, COUNTDOWN, IN_PROGRESS, COMPLETED, ABANDONED
    winner_id VARCHAR(36),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

-- 9. Match Participants Table
CREATE TABLE IF NOT EXISTS match_participants (
    id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    team_slot VARCHAR(10) DEFAULT 'TEAM_A', -- TEAM_A, TEAM_B
    is_ready BOOLEAN DEFAULT FALSE,
    final_score INT DEFAULT 0,
    mmr_delta INT DEFAULT 0,
    xp_earned INT DEFAULT 0,
    tests_passed INT DEFAULT 0,
    is_winner BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_match_participant (match_id, user_id)
);

-- 10. Friend Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    host_user_id VARCHAR(36) NOT NULL,
    mode VARCHAR(30) NOT NULL DEFAULT '1v1',
    difficulty VARCHAR(20) DEFAULT 'Medium',
    language VARCHAR(20) DEFAULT 'Any',
    max_players INT DEFAULT 2,
    is_private BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_user_id) REFERENCES users(id),
    INDEX idx_room_code (code)
);

-- 11. Quest Nodes Table
CREATE TABLE IF NOT EXISTS quest_nodes (
    id VARCHAR(36) PRIMARY KEY,
    node_order INT NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    challenge_id VARCHAR(36) NOT NULL,
    xp_reward INT NOT NULL DEFAULT 150,
    required_node_id VARCHAR(36),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

-- 12. User Quest Progress Table
CREATE TABLE IF NOT EXISTS user_quest_progress (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    quest_node_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'LOCKED', -- LOCKED, UNLOCKED, COMPLETED
    stars_earned INT DEFAULT 0,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quest_node_id) REFERENCES quest_nodes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_quest (user_id, quest_node_id)
);

-- 13. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    badge_icon VARCHAR(10) NOT NULL,
    xp_bonus INT NOT NULL DEFAULT 200
);

-- 14. User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    achievement_id VARCHAR(36) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_achievement (user_id, achievement_id)
);

-- 15. In-App Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id, is_read)
);
