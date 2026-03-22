import * as friendshipRepo from './friendship.repository.js';

export async function getFriendship({ user_id }) {
  return friendshipRepo.getFriendship({ user_id });
}

export async function getMutualGroups({ user1_id, user2_id }) {
  return friendshipRepo.getMutualGroups({ user1_id, user2_id });
}

export async function getMutualFriends({ user1_id, user2_id }) {
  return friendshipRepo.getMutualFriends({ user1_id, user2_id });
}

export async function removeFriendship({ requester_id, receiver_id }) {
  const isFriendshipRemoved = await friendshipRepo.removeFriendship({ requester_id, receiver_id });

  if (!isFriendshipRemoved) {
    console.log("Friendship doesn't exist, so nothing to be removed");
  }
}

export async function sendFriendRequest({ requester_id, receiver_id }) {
  const isRequestSent = await friendshipRepo.sendFriendRequest({ requester_id, receiver_id });

  if (!isRequestSent) {
    throw new Error('Friend request not sent');
  }
}

export async function acceptFriendRequest({ requester_id, receiver_id }) {
  const isRequestAccepted = await friendshipRepo.acceptFriendRequest({ requester_id, receiver_id });

  if (!isRequestAccepted) {
    throw new Error('Friend request not accepted');
  }
}

export async function declineFriendRequest({ requester_id, receiver_id }) {
  const isRequestDeclined = await friendshipRepo.declineFriendRequest({
    requester_id,
    receiver_id,
  });

  if (!isRequestDeclined) {
    throw new Error('Friend request not declined');
  }
}
