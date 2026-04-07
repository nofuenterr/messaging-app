import type { PoolClient } from 'pg';

import type {
  FriendshipRow,
  MutualGroupRow,
  GetFriendshipParams,
  GetMutualGroupsParams,
  GetMutualFriendsParams,
  RemoveFriendshipParams,
  SendFriendRequestParams,
  AcceptFriendRequestParams,
  DeclineFriendRequestParams,
} from '../../types/friendship.types.js';
import type { SafeUser } from '../../types/user.types.js';

import * as friendshipRepo from './friendship.repository.js';

export async function getFriendship({ user_id }: GetFriendshipParams): Promise<FriendshipRow[]> {
  return friendshipRepo.getFriendship({ user_id });
}

export async function getMutualGroups(
  { user1_id, user2_id }: GetMutualGroupsParams,
  client?: PoolClient
): Promise<MutualGroupRow[]> {
  return friendshipRepo.getMutualGroups({ user1_id, user2_id }, client);
}

export async function getMutualFriends(
  { user1_id, user2_id }: GetMutualFriendsParams,
  client?: PoolClient
): Promise<SafeUser[]> {
  return friendshipRepo.getMutualFriends({ user1_id, user2_id }, client);
}

export async function removeFriendship(
  { requester_id, receiver_id }: RemoveFriendshipParams,
  client?: PoolClient
): Promise<void> {
  const isFriendshipRemoved = await friendshipRepo.removeFriendship(
    { requester_id, receiver_id },
    client
  );

  if (!isFriendshipRemoved) {
    console.log("Friendship doesn't exist, nothing to remove");
  }
}

export async function sendFriendRequest({
  requester_id,
  receiver_id,
}: SendFriendRequestParams): Promise<void> {
  const isRequestSent = await friendshipRepo.sendFriendRequest({ requester_id, receiver_id });

  if (!isRequestSent) {
    throw new Error('Friend request not sent');
  }
}

export async function acceptFriendRequest({
  requester_id,
  receiver_id,
}: AcceptFriendRequestParams): Promise<void> {
  const isRequestAccepted = await friendshipRepo.acceptFriendRequest({
    requester_id,
    receiver_id,
  });

  if (!isRequestAccepted) {
    throw new Error('Friend request not accepted');
  }
}

export async function declineFriendRequest({
  requester_id,
  receiver_id,
}: DeclineFriendRequestParams): Promise<void> {
  const isRequestDeclined = await friendshipRepo.declineFriendRequest({
    requester_id,
    receiver_id,
  });

  if (!isRequestDeclined) {
    throw new Error('Friend request not declined');
  }
}
