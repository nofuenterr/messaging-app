import pool from '../../config/database.js';
import { uploadGroupAvatar, uploadGroupBanner } from '../../services/storage.service.js';
import type {
  CreatedGroup,
  CreateGroupServiceParams,
  CreateGroupMessageServiceParams,
  GroupDetailResult,
  GroupJoinLeaveServiceParams,
  KickGroupParams,
  SetGroupRoleParams,
  UpdateGroupServiceParams,
  UpdateGroupProfileParams,
  UserGroupProfileResult,
} from '../../types/group.types.js';
import type { CreatedMessage } from '../../types/message.types.js';
import { NotFoundError } from '../../utils/errors/customErrors.js';
import * as conversationService from '../conversation/conversation.service.js';
import * as friendshipService from '../friendship/friendship.service.js';
import * as messageService from '../message/message.service.js';
import * as noteService from '../note/note.service.js';

import * as groupRepo from './group.repository.js';

export async function getGroups() {
  return groupRepo.getGroups();
}

export async function getUserGroups({ user_id }: { user_id: number }) {
  return groupRepo.getUserGroups({ user_id });
}

export async function createGroup({
  owner_id,
  owner_name,
  group_name,
  group_description,
  avatar_file,
  banner_file,
  avatar_color,
}: CreateGroupServiceParams): Promise<CreatedGroup> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const group = await groupRepo.createGroup(
      { owner_id, group_name, group_description, avatar_color },
      client
    );

    if (!group) {
      throw new Error('Group not created');
    }

    const avatar_url = avatar_file
      ? await uploadGroupAvatar({ group_id: group.id, file: avatar_file })
      : null;

    const banner_url = banner_file
      ? await uploadGroupBanner({ group_id: group.id, file: banner_file })
      : null;

    const areAvatarsUploaded = await groupRepo.updateGroup(
      {
        id: group.id,
        group_name: group.group_name,
        group_description: group.group_description,
        avatar_url,
        banner_url,
      },
      client
    );

    if (!areAvatarsUploaded) {
      throw new Error('Avatars not uploaded');
    }

    const isGroupJoined = await groupRepo.joinGroup(
      { group_id: group.id, user_id: owner_id, membership_role: 'owner' },
      client
    );

    if (!isGroupJoined) {
      throw new Error('Group not joined');
    }

    const conversation_id = await conversationService.createGroupConversation(
      { group_id: group.id },
      client
    );

    const message = await messageService.createMessage(
      {
        author_id: null,
        conversation_id,
        reply_to_message_id: null,
        message_type: 'system',
        system_event_type: 'group_create',
        content: `${owner_name} created the group <<${group.group_name}>>`,
      },
      client
    );

    if (!message) {
      throw new Error('Group system message not created');
    }

    await client.query('COMMIT');

    return group;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function joinGroup({
  group_id,
  user_id,
  name,
}: GroupJoinLeaveServiceParams): Promise<CreatedMessage> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const isGroupJoined = await groupRepo.joinGroup({ group_id, user_id }, client);

    if (!isGroupJoined) {
      throw new Error('Group not joined');
    }

    const conversation = await conversationService.getGroupConversation({ group_id }, client);

    await conversationService.insertGroupConversationMember(
      { conversation_id: conversation.id, user_id },
      client
    );

    const message = await messageService.createMessage(
      {
        author_id: null,
        conversation_id: conversation.id,
        reply_to_message_id: null,
        message_type: 'system',
        system_event_type: 'user_join',
        content: `${name} joined the group`,
      },
      client
    );

    await client.query('COMMIT');

    return message;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function leaveGroup({
  group_id,
  user_id,
  name,
}: GroupJoinLeaveServiceParams): Promise<CreatedMessage> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const isGroupLeft = await groupRepo.leaveGroup({ group_id, user_id }, client);

    if (!isGroupLeft) {
      throw new Error('Group not left');
    }

    const conversation = await conversationService.getGroupConversation({ group_id }, client);

    await conversationService.removeConversationMember(
      { conversation_id: conversation.id, user_id },
      client
    );

    const message = await messageService.createMessage({
      author_id: null,
      conversation_id: conversation.id,
      reply_to_message_id: null,
      message_type: 'system',
      system_event_type: 'user_leave',
      content: `${name} left the group`,
    });

    await client.query('COMMIT');

    return message;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function kickGroup({
  current_user_id,
  group_id,
  user_id,
}: KickGroupParams): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const conversation = await conversationService.getGroupConversation({ group_id }, client);

    const currentUserMembership = await groupRepo.getGroupMembership(
      { group_id, user_id: current_user_id },
      client
    );
    const userToBeKickedMembership = await groupRepo.getGroupMembership(
      { group_id, user_id },
      client
    );

    if (!currentUserMembership) {
      throw new Error('Current user is not a member of this group');
    }

    if (!userToBeKickedMembership) {
      throw new Error('User to be kicked is not a group member');
    }

    const currentUserRole = currentUserMembership.membership_role;
    const userToBeKickedRole = userToBeKickedMembership.membership_role;
    const name = userToBeKickedMembership.group_display_name;

    if (userToBeKickedRole === 'owner') {
      throw new Error('The group owner cannot be kicked');
    }

    const canKick =
      currentUserRole === 'owner' ||
      (currentUserRole === 'admin' && userToBeKickedRole === 'member');

    if (!canKick) {
      throw new Error('You do not have permission to kick this user');
    }

    const isGroupLeft = await groupRepo.leaveGroup({ group_id, user_id }, client);

    if (!isGroupLeft) {
      throw new Error('User not kicked from group');
    }

    await conversationService.removeConversationMember(
      { conversation_id: conversation.id, user_id },
      client
    );

    const message = await messageService.createMessage({
      author_id: null,
      conversation_id: conversation.id,
      reply_to_message_id: null,
      message_type: 'system',
      system_event_type: 'user_kick',
      content: `${name} was kicked from the group`,
    });

    if (!message) {
      throw new Error('Group system message not created');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function setGroupMemberAsAdmin({
  current_user_id,
  group_id,
  user_id,
}: SetGroupRoleParams): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const currentUserMembership = await groupRepo.getGroupMembership(
      { group_id, user_id: current_user_id },
      client
    );
    const targetMembership = await groupRepo.getGroupMembership({ group_id, user_id }, client);

    if (!currentUserMembership) {
      throw new Error('Current user is not a member of this group');
    }

    if (!targetMembership) {
      throw new Error('Target user is not a member of this group');
    }

    if (currentUserMembership.membership_role !== 'owner') {
      throw new Error('Only the group owner can promote members to admin');
    }

    if (targetMembership.membership_role === 'owner') {
      throw new Error('The group owner cannot be assigned another role');
    }

    const isSet = await groupRepo.setGroupMemberAsAdmin({ group_id, user_id }, client);

    if (!isSet) {
      throw new Error('Member not promoted to admin');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function setGroupAdminAsMember({
  current_user_id,
  group_id,
  user_id,
}: SetGroupRoleParams): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const currentUserMembership = await groupRepo.getGroupMembership(
      { group_id, user_id: current_user_id },
      client
    );
    const targetMembership = await groupRepo.getGroupMembership({ group_id, user_id }, client);

    if (!currentUserMembership) {
      throw new Error('Current user is not a member of this group');
    }

    if (!targetMembership) {
      throw new Error('Target user is not a member of this group');
    }

    if (currentUserMembership.membership_role !== 'owner') {
      throw new Error('Only the group owner can demote admins');
    }

    if (targetMembership.membership_role === 'owner') {
      throw new Error('The group owner cannot be assigned another role');
    }

    const isSet = await groupRepo.setGroupAdminAsMember({ group_id, user_id }, client);

    if (!isSet) {
      throw new Error('Admin not demoted to member');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getGroupMessages({
  group_id,
  last_message_id,
}: {
  group_id: number;
  last_message_id?: number;
}) {
  return messageService.getGroupMessages({ group_id, last_message_id });
}

export async function createGroupMessage({
  author_id,
  group_id,
  reply_to_message_id,
  message_type,
  system_event_type,
  content,
}: CreateGroupMessageServiceParams) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const membership = await groupRepo.getGroupMembership({ user_id: author_id, group_id }, client);

    if (!membership) {
      throw new Error('User is not a member of this group');
    }

    const conversation = await conversationService.getGroupConversation({ group_id }, client);

    const message = await messageService.createGroupMessage(
      {
        author_id,
        conversation_id: conversation.id,
        reply_to_message_id,
        message_type,
        system_event_type,
        content,
      },
      client
    );

    await client.query('COMMIT');

    return message;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateGroupMessage({
  id,
  author_id,
  content,
}: {
  id: number;
  author_id: number;
  content: string;
}): Promise<void> {
  await messageService.updateMessage({ id, author_id, content });
}

export async function deleteGroupMessage({
  id,
  author_id,
}: {
  id: number;
  author_id: number;
}): Promise<void> {
  await messageService.deleteMessage({ id, author_id });
}

export async function getGroup({
  group_id,
  user_id,
}: {
  group_id: number;
  user_id: number;
}): Promise<GroupDetailResult> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const group = await groupRepo.getGroup({ id: group_id }, client);

    if (!group) {
      throw new NotFoundError('Group not found');
    }

    const members = await groupRepo.getGroupMembers({ id: group_id }, client);
    const membership = await groupRepo.getGroupMembership({ group_id, user_id }, client);

    await client.query('COMMIT');

    return { info: group, members, membership: membership ?? null };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateGroup({
  id,
  current_user_id,
  group_name,
  group_description,
  avatar_url,
  banner_url,
}: UpdateGroupServiceParams): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const membership = await groupRepo.getGroupMembership(
      { group_id: id, user_id: current_user_id },
      client
    );

    if (!membership || membership.membership_role === 'member') {
      throw new Error('Only group owners and admins can update group details');
    }

    const isGroupUpdated = await groupRepo.updateGroup({
      id,
      group_name,
      group_description,
      avatar_url,
      banner_url,
    });

    if (!isGroupUpdated) {
      throw new Error('Group not updated');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateGroupProfile({
  group_id,
  user_id,
  group_display_name,
  group_pronouns,
}: UpdateGroupProfileParams): Promise<void> {
  const isUpdated = await groupRepo.updateGroupProfile({
    group_id,
    user_id,
    group_display_name,
    group_pronouns,
  });

  if (!isUpdated) {
    throw new Error('Group profile not updated');
  }
}

export async function deleteGroup({ id }: { id: number }): Promise<void> {
  const isGroupDeleted = await groupRepo.deleteGroup({ id });

  if (!isGroupDeleted) {
    throw new Error('Group not deleted');
  }
}

export async function getUserGroupProfile({
  id,
  current_user_id,
  group_id,
}: {
  id: number;
  current_user_id: number;
  group_id: number;
}): Promise<UserGroupProfileResult> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const user = await groupRepo.getUserGroupProfile({ id, current_user_id, group_id }, client);

    if (!user) {
      throw new NotFoundError('User not found in this group');
    }

    const note = await noteService.getNote({ user_id: current_user_id, noted_user_id: id }, client);

    const mutualGroups = await friendshipService.getMutualGroups(
      { user1_id: current_user_id, user2_id: id },
      client
    );

    const mutualFriends = await friendshipService.getMutualFriends(
      { user1_id: current_user_id, user2_id: id },
      client
    );

    await client.query('COMMIT');

    return { user, note: note ?? null, mutualGroups, mutualFriends };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
