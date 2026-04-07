import type { PoolClient } from 'pg';

import type {
  CreatedUser,
  CreateUserParams,
  DeleteUserParams,
  GetUserParams,
  SafeUser,
  UpdateUsernameParams,
  UpdateUserProfileParams,
  UserWithRelations,
} from '../../types/user.types.js';
import { NotFoundError } from '../../utils/errors/customErrors.js';

import * as userRepo from './user.repository.js';

export async function createUser(params: CreateUserParams): Promise<CreatedUser> {
  const user = await userRepo.createUser(params);

  if (!user) throw new Error('User could not be created');

  return user;
}

export async function getUsers(): Promise<SafeUser[]> {
  return userRepo.getUsers();
}

export async function getUserByUsername(username: string): Promise<SafeUser> {
  const user = await userRepo.getUserByUsername(username);

  if (!user) throw new NotFoundError('No user found with that username');

  return user;
}

export async function getUser(
  params: GetUserParams,
  client?: PoolClient
): Promise<UserWithRelations> {
  const user = await userRepo.getUser(params, client);

  if (!user) throw new NotFoundError('User not found');

  return user;
}

export async function updateUserProfile(params: UpdateUserProfileParams): Promise<void> {
  const updated = await userRepo.updateUserProfile(params);

  if (!updated) throw new Error('User profile could not be updated');
}

export async function updateUsername(params: UpdateUsernameParams): Promise<void> {
  const updated = await userRepo.updateUsername(params);

  if (!updated) throw new Error('Username could not be updated');
}

export async function deleteUser(params: DeleteUserParams): Promise<void> {
  const deleted = await userRepo.deleteUser(params);

  if (!deleted) throw new Error('User could not be deleted');
}
