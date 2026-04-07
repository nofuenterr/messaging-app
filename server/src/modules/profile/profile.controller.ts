import { Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { buildErrorObject } from '../../middleware/error.middleware.js';
import { uploadUserAvatar, uploadUserBanner } from '../../services/storage.service.js';
import { ControllerRequest } from '../../types/controllers.type.js';
import type {
  UpdateUserProfileBody,
  UpdateUsernameBody,
  UpsertNoteBody,
  CreateDirectMessageBody,
  UpdateDirectMessageBody,
} from '../../types/profile.types.js';

import * as profileService from './profile.service.js';

export async function updateUserProfile(
  req: ControllerRequest<object, UpdateUserProfileBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
    }

    const { display_name, pronouns, bio } = matchedData(req);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarFile = files?.['avatar_url']?.[0];
    const bannerFile = files?.['banner_url']?.[0];

    const avatar_url = avatarFile
      ? await uploadUserAvatar({ user_id: req.user.id, file: avatarFile })
      : req.body.avatar_url;

    const banner_url = bannerFile
      ? await uploadUserBanner({ user_id: req.user.id, file: bannerFile })
      : req.body.banner_url;

    await profileService.updateUserProfile({
      id: req.user.id,
      avatar_url,
      banner_url,
      display_name,
      pronouns,
      bio,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function updateUsername(
  req: ControllerRequest<object, UpdateUsernameBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
    }

    const { username } = matchedData(req);

    await profileService.updateUsername({ id: req.user.id, username });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getFriendship(req: ControllerRequest, res: Response, next: NextFunction) {
  try {
    const friendship = await profileService.getFriendship({ user_id: req.user.id });
    res.status(200).json(friendship);
  } catch (err) {
    next(err);
  }
}

export async function getBlockList(req: ControllerRequest, res: Response, next: NextFunction) {
  try {
    const blockList = await profileService.getBlockList({ user_id: req.user.id });
    res.status(200).json(blockList);
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUserProfile(
  req: ControllerRequest,
  res: Response,
  next: NextFunction
) {
  try {
    res.status(200).json({
      id: req.user.id,
      created: req.user.created,
      display_name: req.user.display_name,
      username: req.user.username,
      pronouns: req.user.pronouns,
      bio: req.user.bio,
      avatar_color: req.user.avatar_color,
      avatar_url: req.user.avatar_url,
      banner_url: req.user.banner_url,
      deleted: req.user.deleted,
      user_role: req.user.user_role,
    });
  } catch (err) {
    next(err);
  }
}

export async function addFriendByUsername(
  req: ControllerRequest<{ username: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    await profileService.addFriendByUsername({
      current_user_id: req.user.id,
      username: req.params.username,
    });
    res.status(201).end();
  } catch (err) {
    next(err);
  }
}

export async function sendFriendRequest(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await profileService.sendFriendRequest({
      requester_id: req.user.id,
      receiver_id: req.params.id,
    });
    res.status(201).end();
  } catch (err) {
    next(err);
  }
}

export async function acceptFriendRequest(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await profileService.acceptFriendRequest({
      requester_id: req.params.id,
      receiver_id: req.user.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function declineFriendRequest(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await profileService.declineFriendRequest({
      requester_id: req.params.id,
      receiver_id: req.user.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function unfriendUser(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await profileService.unfriendUser({
      requester_id: req.user.id,
      receiver_id: req.params.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function blockUser(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await profileService.blockUser({
      user_id: req.user.id,
      blocked_user_id: req.params.id,
    });
    res.status(201).end();
  } catch (err) {
    next(err);
  }
}

export async function unblockUser(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await profileService.unblockUser({
      user_id: req.user.id,
      unblocked_user_id: req.params.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function upsertNote(
  req: ControllerRequest<{ id: number }, UpsertNoteBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
    }

    const { content } = matchedData(req);

    const note = await profileService.upsertNote({
      user_id: req.user.id,
      noted_user_id: req.params.id,
      content,
    });
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
}

export async function getDirectMessages(
  req: ControllerRequest<{ id: number }, object, { last_message_id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const messages = await profileService.getDirectMessages({
      user1_id: req.user.id,
      user2_id: req.params.id,
      last_message_id: req.query.last_message_id,
    });
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
}

export async function createDirectMessage(
  req: ControllerRequest<{ id: number }, CreateDirectMessageBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
    }

    const { content } = matchedData(req);

    const message = await profileService.createDirectMessage({
      ...req.body,
      author_id: Number(req.user.id),
      other_user_id: Number(req.params.id),
      content,
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function updateDirectMessage(
  req: ControllerRequest<{ messageId: number }, UpdateDirectMessageBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
    }

    const { content } = matchedData(req);

    await profileService.updateDirectMessage({
      id: req.params.messageId,
      author_id: req.user.id,
      content,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function deleteDirectMessage(
  req: ControllerRequest<{ messageId: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await profileService.deleteDirectMessage({
      id: req.params.messageId,
      author_id: req.user.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getUserProfile(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const profile = await profileService.getUserProfile({
      id: req.params.id,
      current_user_id: req.user.id,
    });
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}
