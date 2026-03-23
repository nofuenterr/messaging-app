import { Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { buildErrorObject } from '../../middleware/error.middleware.js';
import { uploadGroupAvatar } from '../../services/storage.service.js';
import { ControllerRequest } from '../../types/controllers.type.js';

import * as groupService from './group.service.js';

export async function getGroups(req: ControllerRequest, res: Response, next: NextFunction) {
  try {
    const groups = await groupService.getGroups();
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
}

export async function getUserGroups(req: ControllerRequest, res: Response, next: NextFunction) {
  try {
    const groups = await groupService.getUserGroups({ user_id: req.user.id });
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
}

export async function createGroup(
  req: ControllerRequest<
    object,
    {
      group_name: string;
      group_description: string;
      avatar_color: string;
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = buildErrorObject(errors);

      return res.status(400).json({
        values: req.body,
        errors: errorObj,
      });
    }

    const { group_name, group_description, avatar_color } = matchedData(req);

    const group = await groupService.createGroup({
      owner_id: req.user.id,
      owner_name: req.user.display_name || req.user.username,
      group_name,
      group_description,
      avatar_color,
    });

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
}

export async function joinGroup(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const message = await groupService.joinGroup({
      group_id: req.params.id,
      user_id: req.user.id,
      name: req.user.display_name || req.user.username,
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function leaveGroup(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const message = await groupService.leaveGroup({
      group_id: req.params.id,
      user_id: req.user.id,
      name: req.user.display_name || req.user.username,
    });
    res.status(204).json(message);
  } catch (err) {
    next(err);
  }
}

export async function kickUser(
  req: ControllerRequest<{ id: number; userId: number }, { name: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    await groupService.kickGroup({
      current_user_id: req.user.id,
      group_id: req.params.id,
      user_id: req.params.userId,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function setGroupMemberAsAdmin(
  req: ControllerRequest<{ id: number; userId: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await groupService.setGroupMemberAsAdmin({
      current_user_id: req.user.id,
      group_id: req.params.id,
      user_id: req.params.userId,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function setGroupAdminAsMember(
  req: ControllerRequest<{ id: number; userId: number }, { conversation_id: number; name: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    await groupService.setGroupAdminAsMember({
      current_user_id: req.user.id,
      group_id: req.params.id,
      user_id: req.params.userId,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getGroupMessages(
  req: ControllerRequest<{ id: number }, object, { last_message_id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const messages = await groupService.getGroupMessages({
      group_id: req.params.id,
      last_message_id: req.query.last_message_id,
    });
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
}

export async function createGroupMessage(
  req: ControllerRequest<
    {
      id: number;
    },
    {
      reply_to_message_id: number;
      message_type: 'text' | 'system';
      system_event_type:
        | 'user_join'
        | 'user_leave'
        | 'user_kick'
        | 'group_rename'
        | 'group_create'
        | 'user_pin'
        | undefined;
      content: string;
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = buildErrorObject(errors);

      return res.status(400).json({
        values: req.body,
        errors: errorObj,
      });
    }

    const { content } = matchedData(req);

    const message = await groupService.createGroupMessage({
      author_id: req.user.id,
      group_id: req.params.id,
      content,
      ...req.body,
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function updateGroupMessage(
  req: ControllerRequest<{ messageId: number }, { content: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = buildErrorObject(errors);

      return res.status(400).json({
        values: req.body,
        errors: errorObj,
      });
    }

    const { content } = matchedData(req);

    await groupService.updateGroupMessage({
      id: req.params.messageId,
      author_id: req.user.id,
      content,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function deleteGroupMessage(
  req: ControllerRequest<{ messageId: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await groupService.deleteGroupMessage({
      id: req.params.messageId,
      author_id: req.user.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getGroup(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const group = await groupService.getGroup({
      group_id: req.params.id,
      user_id: req.user.id,
    });
    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
}

export async function updateGroup(
  req: ControllerRequest<
    { id: number },
    {
      group_name: string;
      group_description: string;
      avatar_url: string;
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = buildErrorObject(errors);

      return res.status(400).json({
        values: req.body,
        errors: errorObj,
      });
    }

    const { group_name, group_description } = matchedData(req);

    const url = req.file
      ? await uploadGroupAvatar({ group_id: req.params.id, file: req.file })
      : req.body.avatar_url;

    await groupService.updateGroup({
      id: req.params.id,
      current_user_id: req.user.id,
      avatar_url: url,
      group_name,
      group_description,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function updateGroupProfile(
  req: ControllerRequest<
    { id: number },
    {
      group_display_name: string;
      group_pronouns: string;
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = buildErrorObject(errors);

      return res.status(400).json({
        values: req.body,
        errors: errorObj,
      });
    }

    const { group_display_name, group_pronouns } = matchedData(req);

    await groupService.updateGroupProfile({
      group_id: req.params.id,
      user_id: req.user.id,
      group_display_name,
      group_pronouns,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function deleteGroup(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await groupService.deleteGroup({
      id: req.params.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
