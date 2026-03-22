import CustomNotFoundError from '../../utils/errors/NotFoundError.js';

import * as userRepo from './user.repository.js';

export async function createUser({ username, password_hash, avatar_color }) {
  const user = await userRepo.createUser({
    username,
    password_hash,
    avatar_color,
  });

  if (!user) {
    throw new Error('User not created');
  }

  return user;
}

export async function getUsers() {
  return userRepo.getUsers();
}

export async function getUser({ id, current_user_id }, client?) {
  const user = await userRepo.getUser({ id, current_user_id }, client);

  if (!user) {
    throw new CustomNotFoundError('User not found');
  }

  return user;
}

export async function updateUserProfile({ id, display_name, pronouns, avatar_url, bio }) {
  const isUserProfileUpdated = await userRepo.updateUserProfile({
    id,
    display_name,
    pronouns,
    avatar_url,
    bio,
  });

  if (!isUserProfileUpdated) {
    throw new Error('User profile not updated');
  }
}

export async function updateUsername({ id, username }) {
  const isUsernameUpdated = await userRepo.updateUsername({ id, username });

  if (!isUsernameUpdated) {
    throw new Error('Username not updated');
  }
}

export async function updateUserAvatar({ id, avatar_url }) {
  const isUserAvatarUpdated = await userRepo.updateUserAvatar({ id, avatar_url });

  if (!isUserAvatarUpdated) {
    throw new Error('User avatar not updated');
  }
}

export async function deleteUser({ id }) {
  const isUserDeleted = await userRepo.deleteUser({ id });

  if (!isUserDeleted) {
    throw new Error('User not deleted');
  }
}
