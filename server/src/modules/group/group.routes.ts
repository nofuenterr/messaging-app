import { Router } from 'express';

import * as uploadMiddleware from '../../middleware/upload.middleware.js';
import * as validationMiddleware from '../../middleware/validation.middleware.js';

import * as groupController from './group.controller.js';

const groupRouter = Router();

// "/groups"
groupRouter.get('/me', groupController.getUserGroups);

groupRouter.get('/', groupController.getGroups);
groupRouter.post('/', validationMiddleware.validateGroup, groupController.createGroup);

groupRouter.post('/:id/join', groupController.joinGroup);
groupRouter.delete('/:id/leave', groupController.leaveGroup);
groupRouter.delete('/:id/kick/:userId', groupController.kickUser);
groupRouter.patch('/:id/set-admin/:userId', groupController.setGroupMemberAsAdmin);
groupRouter.patch('/:id/set-member/:userId', groupController.setGroupAdminAsMember);

groupRouter.get('/:id/messages', groupController.getGroupMessages);
groupRouter.post(
  '/:id/messages',
  validationMiddleware.validateMessage,
  groupController.createGroupMessage
);
groupRouter.patch(
  '/:id/messages/:messageId',
  validationMiddleware.validateMessage,
  groupController.updateGroupMessage
);
groupRouter.delete('/:id/messages/:messageId', groupController.deleteGroupMessage);

groupRouter.patch(
  '/:id/me/profile',
  validationMiddleware.validateGroupProfile,
  groupController.updateGroupProfile
);

groupRouter.get('/:id', groupController.getGroup);
groupRouter.patch(
  '/:id',
  uploadMiddleware.uploadAvatar.single('avatar_url'),
  validationMiddleware.validateGroup,
  groupController.updateGroup
);
groupRouter.delete('/:id', groupController.deleteGroup);

export default groupRouter;
