import { PoolClient } from 'pg';

import type {
  BlockedUserRow,
  AddToBlockListParams,
  RemoveFromBlockListParams,
  GetBlockListParams,
} from '../../types/block.types.js';

import * as blockRepo from './block.repository.js';

export async function addToBlockList(
  params: AddToBlockListParams,
  client?: PoolClient
): Promise<void> {
  const isUserBlocked = await blockRepo.addToBlockList(params, client);

  if (!isUserBlocked) {
    throw new Error('User not blocked');
  }
}

export async function removeFromBlockList({
  user_id,
  unblocked_user_id,
}: RemoveFromBlockListParams): Promise<void> {
  const isUserUnblocked = await blockRepo.removeFromBlockList({ user_id, unblocked_user_id });

  if (!isUserUnblocked) {
    throw new Error('User not unblocked');
  }
}

export async function getBlockList({ user_id }: GetBlockListParams): Promise<BlockedUserRow[]> {
  return blockRepo.getBlockList({ user_id });
}
