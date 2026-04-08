import type { Message } from '../../../../../../../../../types/message.types';
import AvatarContainer from '../../../../../../../components/ui/AvatarContainer';
import type { ProfileType } from '../../../../../../../hooks/useSideProfile';
import { getBorderRadius, getReplyLabel } from '../utils';

import MessageContent from './MessageContent';
import { DeletedRepliedMessage, RepliedMessage } from './RepliedMessageContent';

interface TextMessageProps {
  isCurrentUser: boolean;
  messages: Message[];
  message: Message;
  index: number;
  onToggleProfile: (id: number, type: ProfileType) => void;
  isPermittedToMessage: boolean;
  isLastConvoMessageCurrentUser: boolean;
}

export default function TextMessage({
  isCurrentUser,
  messages,
  message,
  index,
  onToggleProfile,
  isPermittedToMessage,
  showSeparatorAbove,
  nextMessageSeparator,
  currentUserId,
  isLastConvoMessageCurrentUser,
}: TextMessageProps & {
  showSeparatorAbove: boolean;
  nextMessageSeparator: boolean;
  currentUserId: number;
}) {
  /* const messageSentAt = lightFormat(message.sent_at, 'h:mm a'); */
  const hasReply = !!message.replied_message_id;

  // previous in time = index + 1 (reversed list)
  const prevMsg = messages[index + 1];
  const nextMsg = messages[index - 1];

  const prevIsSameUser = prevMsg?.author_id === message.author_id;
  const nextIsSameUser = nextMsg?.author_id === message.author_id;

  // anything that resets the chain
  const prevIsReply = !!prevMsg?.replied_message_id;
  const nextIsReply = !!nextMsg?.replied_message_id;
  const prevIsSystem = prevMsg?.message_type !== 'text';
  const nextIsSystem = nextMsg?.message_type !== 'text';

  const breakAbove = showSeparatorAbove || prevIsReply || prevIsSystem || !prevMsg;
  const breakBelow = nextMessageSeparator || nextIsReply || nextIsSystem || !nextMsg || hasReply;

  // chain membership
  const isChainedAbove = prevIsSameUser && !breakAbove;
  const isChainedBelow = nextIsSameUser && !breakBelow;

  // show name above: first in chain (not chained above) and not current user
  const showName = !isCurrentUser && !isChainedAbove;
  // show avatar: last in chain (not chained below) and not current user
  const showAvatar = !isCurrentUser && !isChainedBelow;

  const messageBorderRadius = getBorderRadius(isCurrentUser, isChainedAbove, isChainedBelow);

  const replyLabel = hasReply
    ? getReplyLabel(
        currentUserId,
        message.author_id!,
        message.replied_message_author_id!,
        message.display_name ?? '',
        message.replied_message_author_name ?? ''
      )
    : null;

  const topMargin = !isChainedAbove || hasReply ? '1rem' : '2px';

  return (
    <div
      className={`flex max-w-[min(32rem,70vw)] items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ marginTop: topMargin }}
    >
      {/* avatar slot — only for other users, preserves space in chain */}
      {!isCurrentUser && (
        <div className="w-10 shrink-0">
          {showAvatar && (
            <AvatarContainer
              avatarUrl={message.avatar_url ?? ''}
              avatarColor={message.avatar_color ?? ''}
              alt={`${message.display_name}'s avatar`}
              className="size-10 cursor-pointer"
              onClick={() => onToggleProfile(message.author_id!, 'user')}
            />
          )}
        </div>
      )}

      {/* bubble column — width driven by content */}
      <div
        className={`flex max-w-full min-w-0 flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
      >
        {/* name or reply label */}
        {replyLabel ? (
          <p className="text-light-800 mb-1 px-1 text-sm">{replyLabel}</p>
        ) : showName ? (
          <p className="text-light-800 mb-1 max-w-full truncate px-1 text-sm">
            {message.display_name}
          </p>
        ) : null}

        {/* replied bubble — overlaps main bubble slightly */}
        {hasReply && (
          <div
            className={`relative z-0 mb-[-0.6rem] w-full ${isCurrentUser ? 'flex justify-end' : 'flex justify-start'}`}
          >
            {message.replied_message_deleted ? (
              <DeletedRepliedMessage isCurrentUser={isCurrentUser} message={message} />
            ) : (
              <RepliedMessage isCurrentUser={isCurrentUser} message={message} />
            )}
          </div>
        )}

        {/* main bubble */}
        <div className="relative z-10">
          <MessageContent
            messageBorderRadius={messageBorderRadius}
            messageSentAt={message.sent_at}
            message={message}
            isCurrentUser={isCurrentUser}
            isPermittedToMessage={isPermittedToMessage}
            isLastConvoMessageCurrentUser={isLastConvoMessageCurrentUser}
          />
        </div>
      </div>
    </div>
  );
}
