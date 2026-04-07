import type { CreatedUser , CreateUserParams } from '../../types/user.types.js';
import * as userService from '../user/user.service.js';

export async function createUser({
  username,
  password_hash,
  avatar_color,
}: CreateUserParams): Promise<CreatedUser> {
  return userService.createUser({ username, password_hash, avatar_color });
}
