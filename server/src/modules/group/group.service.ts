import pool from '../../config/database.js';
import { uploadGroupAvatar, uploadGroupBanner } from '../../services/storage.service.js';
import { NotFoundError } from '../../utils/errors/customErrors.js';
import * as conversationService from '../conversation/conversation.service.js';
import * as messageService from '../message/message.service.js';

import * as groupRepo from './group.repository.js';

export async function getGroups() {
  return groupRepo.getGroups();
}

export async function getUserGroups({ user_id }) {
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
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const group = await groupRepo.createGroup(
      {
        owner_id,
        group_name,
        group_description,
        avatar_color,
      },
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

    if (!conversation_id) {
      throw new Error('Group conversation not created');
    }

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

export async function joinGroup({ group_id, user_id, name }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const isGroupJoined = await groupRepo.joinGroup({ group_id, user_id }, client);

    if (!isGroupJoined) {
      throw new Error('Group not joined');
    }

    const conversation = await conversationService.getGroupConversation({ group_id }, client);
    const conversation_id = conversation.id;

    await conversationService.insertGroupConversationMember({ conversation_id, user_id }, client);

    const message = await messageService.createMessage(
      {
        author_id: null,
        conversation_id,
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

export async function leaveGroup({ group_id, user_id, name }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const isGroupLeft = await groupRepo.leaveGroup({ group_id, user_id }, client);

    if (!isGroupLeft) {
      throw new Error('Group not left');
    }

    const conversation = await conversationService.getGroupConversation({ group_id }, client);
    const conversation_id = conversation.id;

    await conversationService.removeConversationMember({ conversation_id, user_id }, client);

    const message = await messageService.createMessage({
      author_id: null,
      conversation_id,
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

export async function kickGroup({ current_user_id, group_id, user_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const conversation = await conversationService.getGroupConversation({ group_id }, client);
    const conversation_id = conversation.id;

    const currentUserMembership = await groupRepo.getGroupMembership(
      { group_id, user_id: current_user_id },
      client
    );
    const userToBeKickedMembership = await groupRepo.getGroupMembership(
      { group_id, user_id },
      client
    );

    if (!currentUserMembership) {
      throw new Error('Current user is not permitted to kick group members');
    }

    if (!userToBeKickedMembership) {
      throw new Error('User to be kicked is not a group member');
    }

    const name = userToBeKickedMembership.group_display_name;

    const currentUserRole = currentUserMembership.membership_role;
    const userToBeKickedRole = userToBeKickedMembership.membership_role;

    if (currentUserRole === 'owner' || currentUserRole === 'admin') {
      if (userToBeKickedRole === 'admin') {
        if (currentUserRole === 'owner') {
          const isGroupLeft = await groupRepo.leaveGroup({ group_id, user_id }, client);

          if (!isGroupLeft) {
            throw new Error('User not kicked from group');
          }

          await conversationService.removeConversationMember({ conversation_id, user_id }, client);

          const message = await messageService.createMessage({
            author_id: null,
            conversation_id,
            reply_to_message_id: null,
            message_type: 'system',
            system_event_type: 'user_kick',
            content: `${name} was kicked from the group`,
          });

          if (!message) {
            throw new Error('Group system message not created');
          }
        } else {
          throw new Error('Current user is not permitted to kick group owners or admins');
        }
      } else if (userToBeKickedRole === 'owner') {
        throw new Error("Group owner can't me kicked");
      } else {
        const isGroupLeft = await groupRepo.leaveGroup({ group_id, user_id }, client);

        if (!isGroupLeft) {
          throw new Error('User not kicked from group');
        }

        await conversationService.removeConversationMember({ conversation_id, user_id }, client);

        const message = await messageService.createMessage({
          author_id: null,
          conversation_id,
          reply_to_message_id: null,
          message_type: 'system',
          system_event_type: 'user_kick',
          content: `${name} was kicked from the group`,
        });

        if (!message) {
          throw new Error('Group system message not created');
        }
      }
    } else {
      throw new Error('Current user is not permitted to kick group owner, admins or members');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function setGroupMemberAsAdmin({ current_user_id, group_id, user_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const currentUserMembership = await groupRepo.getGroupMembership(
      { group_id, user_id: current_user_id },
      client
    );
    const setUserMembership = await groupRepo.getGroupMembership({ group_id, user_id }, client);

    if (!currentUserMembership) {
      throw new Error('Current user is not permitted to set group members as admin');
    }

    if (!setUserMembership) {
      throw new Error('User to be set as admin is not a group member');
    }

    const currentUserRole = currentUserMembership.membership_role;
    const setUserRole = setUserMembership.membership_role;

    if (currentUserRole === 'owner') {
      if (setUserRole !== 'owner') {
        const isGroupMemberSetAsAdmin = groupRepo.setGroupMemberAsAdmin(
          { group_id, user_id },
          client
        );

        if (!isGroupMemberSetAsAdmin) {
          throw new Error('Group member not set as admin');
        }
      } else {
        throw new Error("Group owner can't be set as group member or admin");
      }
    } else {
      throw new Error('Current user is not permitted to set group owner or members as admin');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function setGroupAdminAsMember({ current_user_id, group_id, user_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const currentUserMembership = await groupRepo.getGroupMembership(
      { group_id, user_id: current_user_id },
      client
    );
    const setUserMembership = await groupRepo.getGroupMembership({ group_id, user_id }, client);

    if (!currentUserMembership) {
      throw new Error('Current user is not permitted to set group members as admin');
    }

    if (!setUserMembership) {
      throw new Error('User to be set as member is not part of the group');
    }

    const currentUserRole = currentUserMembership.membership_role;
    const setUserRole = setUserMembership.membership_role;

    if (currentUserRole === 'owner') {
      if (setUserRole !== 'owner') {
        const isGroupMemberSetAsAdmin = groupRepo.setGroupAdminAsMember(
          { group_id, user_id },
          client
        );

        if (!isGroupMemberSetAsAdmin) {
          throw new Error('Group admin not set as member');
        }
      } else {
        throw new Error("Group owner can't be set as group member or admin");
      }
    } else {
      throw new Error('Current user is not permitted to set group owner or admins as member');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getGroupMessages({ group_id, last_message_id }) {
  return messageService.getGroupMessages({ group_id, last_message_id });
}

export async function createGroupMessage({
  author_id,
  group_id,
  reply_to_message_id,
  message_type,
  system_event_type,
  content,
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let message;
    const membership = await groupRepo.getGroupMembership({ user_id: author_id, group_id }, client);

    if (membership) {
      const conversation = await conversationService.getGroupConversation({ group_id }, client);
      const conversation_id = conversation.id;

      message = await messageService.createGroupMessage(
        {
          author_id,
          conversation_id,
          reply_to_message_id,
          message_type,
          system_event_type,
          content,
        },
        client
      );
    } else {
      throw new Error('User is not permitted to send group messages');
    }

    await client.query('COMMIT');

    return message;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateGroupMessage({ id, author_id, content }) {
  await messageService.updateMessage({ id, author_id, content });
}

export async function deleteGroupMessage({ id, author_id }) {
  await messageService.deleteMessage({ id, author_id });
}

export async function getGroup({ group_id, user_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const group = await groupRepo.getGroup({ id: group_id }, client);

    if (!group) {
      throw new NotFoundError('Group not found');
    }

    const groupMembers = await groupRepo.getGroupMembers({ id: group_id }, client);

    const groupMembership = await groupRepo.getGroupMembership({ group_id, user_id }, client);

    await client.query('COMMIT');

    return { info: group, members: groupMembers, membership: groupMembership };
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
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const membership = await groupRepo.getGroupMembership(
      { group_id: id, user_id: current_user_id },
      client
    );

    if (!membership || membership.membership_role === 'member') {
      throw new Error('Current user is not permitted to update group details');
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
}) {
  const isGroupProfileUpdated = await groupRepo.updateGroupProfile({
    group_id,
    user_id,
    group_display_name,
    group_pronouns,
  });

  if (!isGroupProfileUpdated) {
    throw new Error('Group profile not updated');
  }
}

export async function deleteGroup({ id }) {
  const isGroupDeleted = await groupRepo.deleteGroup({ id });

  if (!isGroupDeleted) {
    throw new Error('Group not deleted');
  }
}
