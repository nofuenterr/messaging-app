import pool from '../../config/database.js';
import * as blockService from '../block/block.service.js';
import * as friendshipService from '../friendship/friendship.service.js';
import * as messageService from '../message/message.service.js';
import * as noteService from '../note/note.service.js';
import * as userService from '../user/user.service.js';

export async function updateUserProfile({ id, display_name, pronouns, avatar_url, bio }) {
  await userService.updateUserProfile({ id, display_name, pronouns, avatar_url, bio });
}

export async function updateUsername({ id, username }) {
  await userService.updateUsername({ id, username });
}

export async function updateUserAvatar({ id, avatar_url }) {
  await userService.updateUserAvatar({ id, avatar_url });
}

export async function getFriendship({ user_id }) {
  return friendshipService.getFriendship({ user_id });
}

export async function getBlockList({ user_id }) {
  return blockService.getBlockList({ user_id });
}

export async function sendFriendRequest({ requester_id, receiver_id }) {
  await friendshipService.sendFriendRequest({ requester_id, receiver_id });
}

export async function acceptFriendRequest({ requester_id, receiver_id }) {
  await friendshipService.acceptFriendRequest({ requester_id, receiver_id });
}

export async function declineFriendRequest({ requester_id, receiver_id }) {
  await friendshipService.declineFriendRequest({ requester_id, receiver_id });
}

export async function unfriendUser({ requester_id, receiver_id }) {
  await friendshipService.removeFriendship({ requester_id, receiver_id });
}

export async function blockUser({ user_id, blocked_user_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await friendshipService.removeFriendship(
      {
        requester_id: user_id,
        receiver_id: blocked_user_id,
      },
      client
    );

    await blockService.addToBlockList({ user_id, blocked_user_id }, client);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function unblockUser({ user_id, unblocked_user_id }) {
  await blockService.removeFromBlockList({ user_id, unblocked_user_id });
}

export async function upsertNote({ user_id, noted_user_id, content }) {
  return noteService.upsertNote({ user_id, noted_user_id, content });
}

export async function getDirectMessages({ user1_id, user2_id, last_message_id }) {
  return messageService.getDirectMessages({ user1_id, user2_id, last_message_id });
}

export async function createDirectMessage({
  author_id,
  other_user_id,
  reply_to_message_id,
  message_type,
  system_event_type,
  content,
}) {
  return messageService.createDirectMessage({
    author_id,
    other_user_id,
    reply_to_message_id,
    message_type,
    system_event_type,
    content,
  });
}

export async function updateDirectMessage({ id, author_id, content }) {
  await messageService.updateMessage({ id, author_id, content });
}

export async function deleteDirectMessage({ id, author_id }) {
  await messageService.deleteMessage({ id, author_id });
}

export async function getUserProfile({ id, current_user_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const user = await userService.getUser({ id, current_user_id }, client);

    const note = await noteService.getNote({ user_id: current_user_id, noted_user_id: id }, client);

    const mutualGroups = await friendshipService.getMutualGroups(
      {
        user1_id: current_user_id,
        user2_id: id,
      },
      client
    );

    const mutualFriends = await friendshipService.getMutualFriends(
      {
        user1_id: current_user_id,
        user2_id: id,
      },
      client
    );

    await client.query('COMMIT');
    return { user, note, mutualGroups, mutualFriends };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
