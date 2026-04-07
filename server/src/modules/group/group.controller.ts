import { Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { buildErrorObject } from '../../middleware/error.middleware.js';
import { uploadGroupAvatar, uploadGroupBanner } from '../../services/storage.service.js';
import { ControllerRequest } from '../../types/controllers.type.js';
import type { MessageType, SystemEventType } from '../../types/message.types.js';

import * as groupService from './group.service.js';

export async function getGroups(
  req: ControllerRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const groups = await groupService.getGroups();
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
}

export async function getUserGroups(
  req: ControllerRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
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
    { group_name: string; group_description?: string; avatar_color: string }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
      return;
    }

    const { group_name, group_description, avatar_color } = matchedData(req);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarFile = files['avatar_url']?.[0];
    const bannerFile = files['banner_url']?.[0];

    const group = await groupService.createGroup({
      owner_id: req.user.id,
      owner_name: req.user.display_name ?? req.user.username,
      group_name,
      group_description,
      avatar_file: avatarFile,
      banner_file: bannerFile,
      avatar_color,
    });

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
}

export async function joinGroup(
  req: ControllerRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const message = await groupService.joinGroup({
      group_id: Number(req.params.id),
      user_id: req.user.id,
      name: req.user.display_name ?? req.user.username,
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function leaveGroup(
  req: ControllerRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const message = await groupService.leaveGroup({
      group_id: Number(req.params.id),
      user_id: req.user.id,
      name: req.user.display_name ?? req.user.username,
    });
    res.status(204).json(message);
  } catch (err) {
    next(err);
  }
}

export async function kickUser(
  req: ControllerRequest<{ id: string; userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await groupService.kickGroup({
      current_user_id: req.user.id,
      group_id: Number(req.params.id),
      user_id: Number(req.params.userId),
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function setGroupMemberAsAdmin(
  req: ControllerRequest<{ id: string; userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await groupService.setGroupMemberAsAdmin({
      current_user_id: req.user.id,
      group_id: Number(req.params.id),
      user_id: Number(req.params.userId),
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function setGroupAdminAsMember(
  req: ControllerRequest<{ id: string; userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await groupService.setGroupAdminAsMember({
      current_user_id: req.user.id,
      group_id: Number(req.params.id),
      user_id: Number(req.params.userId),
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getGroupMessages(
  req: ControllerRequest<{ id: string }, object, { last_message_id?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const messages = await groupService.getGroupMessages({
      group_id: Number(req.params.id),
      last_message_id: req.query.last_message_id ? Number(req.query.last_message_id) : undefined,
    });
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
}

export async function createGroupMessage(
  req: ControllerRequest<
    { id: string },
    {
      reply_to_message_id?: number;
      message_type?: MessageType;
      system_event_type?: SystemEventType;
      content: string;
    }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
      return;
    }

    const { content } = matchedData(req);

    const message = await groupService.createGroupMessage({
      author_id: req.user.id,
      group_id: Number(req.params.id),
      content,
      reply_to_message_id: req.body.reply_to_message_id,
      message_type: req.body.message_type,
      system_event_type: req.body.system_event_type,
    });

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function updateGroupMessage(
  req: ControllerRequest<{ messageId: string }, { content: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
      return;
    }

    const { content } = matchedData(req);

    await groupService.updateGroupMessage({
      id: Number(req.params.messageId),
      author_id: req.user.id,
      content,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function deleteGroupMessage(
  req: ControllerRequest<{ messageId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await groupService.deleteGroupMessage({
      id: Number(req.params.messageId),
      author_id: req.user.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getGroup(
  req: ControllerRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const group = await groupService.getGroup({
      group_id: Number(req.params.id),
      user_id: req.user.id,
    });
    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
}

export async function updateGroup(
  req: ControllerRequest<
    { id: string },
    { group_name: string; group_description?: string; avatar_url?: string; banner_url?: string }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
      return;
    }

    const { group_name, group_description } = matchedData(req);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarFile = files['avatar_url']?.[0];
    const bannerFile = files['banner_url']?.[0];

    const avatar_url = avatarFile
      ? await uploadGroupAvatar({ group_id: Number(req.params.id), file: avatarFile })
      : req.body.avatar_url;

    const banner_url = bannerFile
      ? await uploadGroupBanner({ group_id: Number(req.params.id), file: bannerFile })
      : req.body.banner_url;

    await groupService.updateGroup({
      id: Number(req.params.id),
      current_user_id: req.user.id,
      avatar_url,
      banner_url,
      group_name,
      group_description,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function updateGroupProfile(
  req: ControllerRequest<{ id: string }, { group_display_name?: string; group_pronouns?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
      return;
    }

    const { group_display_name, group_pronouns } = matchedData(req);

    await groupService.updateGroupProfile({
      group_id: Number(req.params.id),
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
  req: ControllerRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await groupService.deleteGroup({ id: Number(req.params.id) });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getUserGroupProfile(
  req: ControllerRequest<{ id: string; userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const profile = await groupService.getUserGroupProfile({
      id: Number(req.params.userId),
      current_user_id: req.user.id,
      group_id: Number(req.params.id),
    });
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}
