import type { PoolClient } from 'pg';

import pool from '../../config/database.js';
import type {
  UpdateUserProfileParams,
  UpdateUsernameParams,
  GetFriendshipParams,
  GetBlockListParams,
  AddFriendByUsernameParams,
  SendFriendRequestParams,
  AcceptFriendRequestParams,
  DeclineFriendRequestParams,
  UnfriendUserParams,
  BlockUserParams,
  UnblockUserParams,
  UpsertNoteParams,
  GetDirectMessagesParams,
  CreateDirectMessageParams,
  UpdateDirectMessageParams,
  DeleteDirectMessageParams,
  GetUserProfileParams,
  UserProfileResponse,
} from '../../types/profile.types.js';
import { NotFoundError } from '../../utils/errors/customErrors.js';
import * as blockService from '../block/block.service.js';
import * as friendshipService from '../friendship/friendship.service.js';
import * as messageService from '../message/message.service.js';
import * as noteService from '../note/note.service.js';
import * as userService from '../user/user.service.js';

export async function updateUserProfile(params: UpdateUserProfileParams): Promise<void> {
  await userService.updateUserProfile(params);
}

export async function updateUsername(params: UpdateUsernameParams): Promise<void> {
  await userService.updateUsername(params);
}

export async function getFriendship({ user_id }: GetFriendshipParams) {
  return friendshipService.getFriendship({ user_id });
}

export async function getBlockList({ user_id }: GetBlockListParams) {
  return blockService.getBlockList({ user_id });
}

export async function addFriendByUsername({
  current_user_id,
  username,
}: AddFriendByUsernameParams): Promise<void> {
  const user = await userService.getUserByUsername(username);

  if (user.id === current_user_id) {
    throw new NotFoundError("Hm, didn't work. Double check that the username is correct.");
  }

  await friendshipService.sendFriendRequest({
    requester_id: current_user_id,
    receiver_id: user.id,
  });
}

export async function sendFriendRequest(params: SendFriendRequestParams): Promise<void> {
  await friendshipService.sendFriendRequest(params);
}

export async function acceptFriendRequest(params: AcceptFriendRequestParams): Promise<void> {
  await friendshipService.acceptFriendRequest(params);
}

export async function declineFriendRequest(params: DeclineFriendRequestParams): Promise<void> {
  await friendshipService.declineFriendRequest(params);
}

export async function unfriendUser({
  requester_id,
  receiver_id,
}: UnfriendUserParams): Promise<void> {
  await friendshipService.removeFriendship({ requester_id, receiver_id });
}

export async function blockUser({ user_id, blocked_user_id }: BlockUserParams): Promise<void> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    await friendshipService.removeFriendship(
      { requester_id: user_id, receiver_id: blocked_user_id },
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

export async function unblockUser(params: UnblockUserParams): Promise<void> {
  await blockService.removeFromBlockList(params);
}

export async function upsertNote(params: UpsertNoteParams) {
  return noteService.upsertNote(params);
}

export async function getDirectMessages(params: GetDirectMessagesParams) {
  return messageService.getDirectMessages(params);
}

export async function createDirectMessage(params: CreateDirectMessageParams) {
  return messageService.createDirectMessage(params);
}

export async function updateDirectMessage(params: UpdateDirectMessageParams): Promise<void> {
  await messageService.updateMessage(params);
}

export async function deleteDirectMessage(params: DeleteDirectMessageParams): Promise<void> {
  await messageService.deleteMessage(params);
}

export async function getUserProfile({
  id,
  current_user_id,
}: GetUserProfileParams): Promise<UserProfileResponse> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    const user = await userService.getUser({ id, current_user_id }, client);
    const note = await noteService.getNote({ user_id: current_user_id, noted_user_id: id }, client);
    const mutualGroups = await friendshipService.getMutualGroups(
      { user1_id: current_user_id, user2_id: id },
      client
    );
    const mutualFriends = await friendshipService.getMutualFriends(
      { user1_id: current_user_id, user2_id: id },
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
