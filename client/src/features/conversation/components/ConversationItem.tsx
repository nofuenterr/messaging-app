import { NavLink } from 'react-router-dom';

import type { ConversationWithLatestMessage } from '../../../../../types/message.types';
import type { User } from '../../../../../types/user.types';
import GroupIcon from '../../../components/icons/GroupIcon';
import AvatarContainer from '../../../components/ui/AvatarContainer';
import formatTime from '../../../utils/formatTime';

interface ConversationItemProps {
  convo: ConversationWithLatestMessage;
  user: User;
}

export default function ConversationItem({ convo, user }: ConversationItemProps) {
  const type = convo.conversation_type === 'direct' ? 'users' : 'groups';
  const paramsId = convo.group_id ?? convo.other_user_id;
  const isCurrentUser = convo.author_id === user.id;

  return (
    <li>
      <NavLink
        to={`/${type}/${paramsId}/messages`}
        className={({ isActive }) =>
          `hover:bg-dark-400 block rounded-full ${isActive ? 'bg-dark-600' : ''}`
        }
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <AvatarContainer
            avatarUrl={convo.display_avatar_url}
            avatarColor={convo.display_avatar_color}
            alt={`${convo.display_name}'s avatar`}
            className="size-12"
          />
          <ConversationBody isCurrentUser={isCurrentUser} convo={convo} />
        </div>
      </NavLink>
    </li>
  );
}

interface ConversationBodyProps {
  isCurrentUser: boolean;
  convo: ConversationWithLatestMessage;
}

function ConversationBody({ isCurrentUser, convo }: ConversationBodyProps) {
  return (
    <div className="grid">
      <div className="flex items-center gap-2 overflow-hidden">
        {convo.conversation_type === 'group' && <GroupIcon className="size-4 shrink-0" />}
        <h2 className="truncate font-medium">{convo.display_name}</h2>
      </div>

      <div className="flex items-center gap-1 overflow-hidden text-sm">
        {convo.author_id ? (
          <>
            {convo.deleted ? (
              <p className="truncate italic">
                {isCurrentUser ? 'You' : convo.author_display_name} deleted a message
              </p>
            ) : (
              <p className="truncate">
                {isCurrentUser
                  ? 'You: '
                  : convo.conversation_type === 'group'
                    ? `${convo.author_display_name}: `
                    : null}
                {convo.content}
              </p>
            )}
          </>
        ) : (
          <p className="truncate">{convo.content}</p>
        )}
        <span>-</span>
        <p className="whitespace-nowrap">{formatTime(convo.sent_at)}</p>
      </div>
    </div>
  );
}
