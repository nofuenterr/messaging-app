import * as blockRepo from './block.repository.js';

export async function addToBlockList({ user_id, blocked_user_id }) {
  const isUserBlocked = await blockRepo.addToBlockList({ user_id, blocked_user_id });

  if (!isUserBlocked) {
    throw new Error('User not blocked');
  }
}

export async function removeFromBlockList({ user_id, unblocked_user_id }) {
  const isUserUnblocked = await blockRepo.removeFromBlockList({ user_id, unblocked_user_id });

  if (!isUserUnblocked) {
    throw new Error('User not unblocked');
  }
}

export async function getBlockList({ user_id }) {
  return blockRepo.getBlockList({ user_id });
}
