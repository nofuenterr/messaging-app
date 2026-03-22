CREATE OR REPLACE VIEW users_safe AS
SELECT
  id,
  created,
  COALESCE(NULLIF(display_name, ''), username) AS display_name,
  username,
  pronouns,
  bio,
  avatar_color,
  avatar_url,
  user_role,
  deleted
FROM users;

CREATE OR REPLACE VIEW membership_safe AS
SELECT
  mem.group_id,
  mem.user_id,
  mem.joined,
  mem.membership_role,
  mem.left_at,
  COALESCE(
    NULLIF(mem.group_display_name, ''),
    u.display_name
  ) AS group_display_name,
  COALESCE(
    NULLIF(mem.group_pronouns, ''),
    u.pronouns
  ) AS group_pronouns

FROM membership mem
JOIN users_safe u
  ON u.id = mem.user_id;