import * as userService from '../user/user.service.js';

export async function createUser({ username, password_hash, avatar_color }) {
  return userService.createUser({ username, password_hash, avatar_color });
}
