import { Response, NextFunction } from 'express';

import { ControllerRequest } from '../../types/controllers.type.js';

import * as homeService from './home.service.js';

export async function getUserConversationsWithLatestMessage(
  req: ControllerRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversations = await homeService.getUserConversationsWithLatestMessage({
      user_id: req.user.id,
    });
    res.status(200).json(conversations);
  } catch (err) {
    next(err);
  }
}
