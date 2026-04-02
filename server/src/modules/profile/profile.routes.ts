import { Router } from 'express';

import * as uploaDirectiddleware from '../../middleware/upload.middleware.js';
import * as validationMiddleware from '../../middleware/validation.middleware.js';

import * as profileController from './profile.controller.js';

const profileRouter = Router();

// "/users"
profileRouter.patch(
  '/me/profile',
  uploaDirectiddleware.uploadAvatar.single('avatar_url'),
  validationMiddleware.validateUserProfile,
  profileController.updateUserProfile
);
profileRouter.patch(
  '/me/username',
  validationMiddleware.validateUsername,
  profileController.updateUsername
);
profileRouter.patch(
  '/me/avatar',
  uploaDirectiddleware.uploadAvatar.single('avatar_url'),
  profileController.updateUserAvatar
);

profileRouter.get('/me/friends', profileController.getFriendship);
profileRouter.get('/me/blocks', profileController.getBlockList);

profileRouter.get('/me', profileController.getCurrentUserProfile);

profileRouter.post('/:id/friend-request', profileController.sendFriendRequest);
profileRouter.patch('/:id/friend-request/accept', profileController.acceptFriendRequest);
profileRouter.patch('/:id/friend-request/decline', profileController.declineFriendRequest);
profileRouter.delete('/:id/friend', profileController.unfriendUser);

profileRouter.post('/:id/block', profileController.blockUser);
profileRouter.delete('/:id/block', profileController.unblockUser);

profileRouter.put('/:id/note', validationMiddleware.validateNote, profileController.upsertNote);

profileRouter.get('/:id/messages', profileController.getDirectMessages);
profileRouter.post(
  '/:id/messages',
  validationMiddleware.validateMessage,
  profileController.createDirectMessage
);
profileRouter.patch(
  '/:id/messages/:messageId',
  validationMiddleware.validateMessage,
  profileController.updateDirectMessage
);
profileRouter.delete('/:id/messages/:messageId', profileController.deleteDirectMessage);

profileRouter.get('/:id', profileController.getUserProfile);

export default profileRouter;
