CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  display_name VARCHAR(50),
  username VARCHAR(30) NOT NULL UNIQUE,
  pronouns VARCHAR(20),
  bio VARCHAR(190),
  password_hash VARCHAR(60) NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT '#b8aafe',
  avatar_url VARCHAR(255) DEFAULT '/images/users/avatar/default.webp',
  banner_url VARCHAR(255),
  user_role VARCHAR(10) CHECK (user_role IN ('admin','user')) NOT NULL DEFAULT 'user',
  deleted TIMESTAMPTZ,
  CHECK (TRIM(username) <> ''),
  CHECK (password_hash <> '')
);

CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  group_name VARCHAR(50) NOT NULL,
  group_description VARCHAR(190),
  avatar_color TEXT NOT NULL,
  avatar_url VARCHAR(255) DEFAULT '/images/groups/avatar/default.webp',
  banner_url VARCHAR(255),
  deleted TIMESTAMPTZ,
  CHECK (TRIM(group_name) <> '')
);

CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  conversation_type VARCHAR(10) CHECK (conversation_type IN ('direct','group')) NOT NULL,
  latest_message_id INTEGER,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  user1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  CHECK (
    (
      conversation_type = 'group' 
      AND group_id IS NOT NULL 
      AND user1_id IS NULL 
      AND user2_id IS NULL
    )
    OR
    (
      conversation_type = 'direct' 
      AND group_id IS NULL 
      AND user1_id IS NOT NULL 
      AND user2_id IS NOT NULL
    )
  )
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  reply_to INTEGER REFERENCES messages(id),
  message_type VARCHAR(10) CHECK (message_type IN ('text','system')) NOT NULL DEFAULT 'text',
  system_event_type VARCHAR(20) 
  CHECK (
    (
      message_type = 'system'
      AND system_event_type IS NOT NULL
      AND system_event_type IN ('user_join','user_leave','user_kick','group_rename','group_create','user_pin')
      AND author_id IS NULL
    )
    OR
    (
      message_type = 'text'
      AND system_event_type IS NULL
      AND author_id IS NOT NULL
    )
  ),
  content TEXT NOT NULL,
  last_edited TIMESTAMPTZ,
  deleted TIMESTAMPTZ,
  CHECK (TRIM(content) <> '')
);

CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS message_attachment (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER
);

CREATE TABLE IF NOT EXISTS friendship (
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friendship_status VARCHAR(10) CHECK (friendship_status IN ('pending','accepted', 'declined')) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (requester_id, receiver_id),
  CHECK (requester_id <> receiver_id)
);

CREATE TABLE IF NOT EXISTS membership (
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  group_display_name VARCHAR(50),
  group_pronouns VARCHAR(20),
  membership_role VARCHAR(10) CHECK (membership_role IN ('owner','admin', 'member')) NOT NULL DEFAULT 'member',
  PRIMARY KEY (group_id, user_id),
  left_at TIMESTAMPTZ,
  CHECK (group_display_name IS NULL OR TRIM(group_display_name) <> '')
);

CREATE TABLE IF NOT EXISTS user_block (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, blocked_user_id),
  CHECK (user_id <> blocked_user_id)
);

CREATE TABLE IF NOT EXISTS user_note (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  noted_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  noted TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  content VARCHAR(255),
  PRIMARY KEY (user_id, noted_user_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  target_user_id INTEGER REFERENCES users(id)  ON DELETE SET NULL,
  target_message_id INTEGER REFERENCES messages(id) ON DELETE SET NULL,
  target_group_id INTEGER REFERENCES groups(id)  ON DELETE SET NULL, 
  reason VARCHAR(255) NOT NULL,
  report_status VARCHAR(10) CHECK (report_status IN ('open','reviewed', 'resolved')) NOT NULL DEFAULT 'open',
  CHECK (TRIM(reason) <> '')
);

ALTER TABLE conversations
ADD CONSTRAINT fk_latest_message
FOREIGN KEY (latest_message_id) REFERENCES messages(id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_dm_pair
ON conversations (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id))
WHERE conversation_type = 'direct';

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_id_desc
ON messages (conversation_id, id DESC);

CREATE INDEX IF NOT EXISTS idx_membership_user
ON membership (user_id);

CREATE INDEX IF NOT EXISTS idx_conversation_members_user
ON conversation_members (user_id);

CREATE INDEX IF NOT EXISTS idx_friendship_user_lookup
ON friendship (requester_id, receiver_id);

CREATE INDEX IF NOT EXISTS idx_block_user
ON user_block (user_id);

CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW()
);