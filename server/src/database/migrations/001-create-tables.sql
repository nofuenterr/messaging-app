CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  display_name VARCHAR(50),
  username VARCHAR(30) NOT NULL UNIQUE,
  pronouns VARCHAR(20),
  bio VARCHAR(190),
  password_hash VARCHAR(255) NOT NULL,
  avatar_color TEXT NOT NULL,
  avatar_url VARCHAR(255) DEFAULT '/images/user/avatar/default.webp',
  user_role VARCHAR(10) CHECK (user_role IN ('admin','user')) NOT NULL DEFAULT 'user',
  deleted TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  group_name VARCHAR(50) NOT NULL,
  group_description TEXT, -- Validate character limit client-side
  avatar_color TEXT NOT NULL,
  avatar_url VARCHAR(255) DEFAULT '/images/group/avatar/default.webp',
  deleted TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  conversation_type VARCHAR(10) CHECK (conversation_type IN ('dm','group')) NOT NULL,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE -- Only exists when type='group'
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  reply_to INTEGER REFERENCES messages(id),
  message_type VARCHAR(10) CHECK (message_type IN ('text','system')) NOT NULL DEFAULT 'text',
  system_event_type VARCHAR(20) 
  CHECK (system_event_type IN ('user_join','user_leave', 'group_rename', 'user_pin')) -- Only exists when type='system',
  content TEXT NOT NULL, -- Validate character limit client-side
  last_edited TIMESTAMPTZ,
  deleted TIMESTAMPTZ
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
  file_url TEXT, -- Validate character limit client-side
  file_type TEXT, -- Validate character limit client-side
  file_size INTEGER -- Convert to MB in UI
);

-- Unfriending user should remove appropriate row
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
  group_nickname VARCHAR(50),
  group_pronouns VARCHAR(20),
  membership_role VARCHAR(10) CHECK (membership_role IN ('owner','admin', 'member')) NOT NULL DEFAULT 'member',
  PRIMARY KEY (group_id, user_id),
  left TIMESTAMPTZ
);

-- Blocking user should remove appropriate friendship row (if it exists)
CREATE TABLE IF NOT EXISTS user_block (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, blocked_user_id)
);

CREATE TABLE IF NOT EXISTS user_note (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  noted_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  noted TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  content VARCHAR(255), -- Validate character limit client-side
  PRIMARY KEY (user_id, noted_user_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  target_user_id INTEGER REFERENCES users(id)  ON DELETE SET NULL,
  target_message_id INTEGER REFERENCES messages(id) ON DELETE SET NULL,
  target_group_id INTEGER REFERENCES groups(id)  ON DELETE SET NULL, 
  reason VARCHAR(255) NOT NULL, -- Validate character limit client-side
  report_status VARCHAR(10) CHECK (report_status IN ('open','reviewed', 'resolved')) NOT NULL DEFAULT 'open',
);

-- Indexes
-- Fetch messages in a conversation quickly
CREATE INDEX IF NOT EXISTS idx_messages_conversation_sent
ON messages(conversation_id, sent);

-- Fetch messages by author (moderation / history)
CREATE INDEX IF NOT EXISTS idx_messages_author
ON messages(author_id);

-- Membership lookup by user
CREATE INDEX IF NOT EXISTS idx_membership_user
ON membership(user_id);

-- Conversation membership lookup by user
CREATE INDEX IF NOT EXISTS idx_conversation_members_user
ON conversation_members(user_id);

/* Future features: pinned messages (dm / group), saved messages */

-- migration tracking
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW()
);