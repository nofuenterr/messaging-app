import type { Message } from '../../../../../../../../../types/message.types';
import formatTime from '../../../../../../../utils/formatTime';
import { useShowMessageSentAtStore } from '../store/useShowMessageSentAt';

import MessageContextMenu from './MessageContextMenu';

interface MessageContentProps {
  messageBorderRadius: string;
  messageSentAt: string;
  message: Message;
  isCurrentUser: boolean;
  isPermittedToMessage: boolean;
  isLastConvoMessageCurrentUser: boolean;
}

export default function MessageContent({
  messageBorderRadius,
  messageSentAt,
  message,
  isCurrentUser,
  isPermittedToMessage,
  isLastConvoMessageCurrentUser,
}: MessageContentProps) {
  return (
    <>
      {message.deleted ? (
        <DeletedMessageBubble
          borderRadius={messageBorderRadius}
          isCurrentUser={isCurrentUser}
          sentAt={messageSentAt}
          message={message}
          isLastConvoMessageCurrentUser={isLastConvoMessageCurrentUser}
        />
      ) : (
        <MessageBubble
          borderRadius={messageBorderRadius}
          isCurrentUser={isCurrentUser}
          sentAt={messageSentAt}
          message={message}
          isPermittedToMessage={isPermittedToMessage}
          isLastConvoMessageCurrentUser={isLastConvoMessageCurrentUser}
        />
      )}
    </>
  );
}

interface MessageBubbleProps {
  borderRadius: string;
  isCurrentUser: boolean;
  sentAt: string;
  message: Message;
  isPermittedToMessage?: boolean;
  isLastConvoMessageCurrentUser: boolean;
}

function MessageBubble({
  borderRadius,
  isCurrentUser,
  sentAt,
  message,
  isPermittedToMessage,
  isLastConvoMessageCurrentUser,
}: MessageBubbleProps) {
  const { messageId, setMessageId } = useShowMessageSentAtStore();

  const bubbleStyle = {
    borderRadius,
    backgroundColor: isCurrentUser ? 'var(--color-primary)' : 'var(--color-dark-500)',
    borderColor: isCurrentUser ? 'var(--color-primary-soft)' : 'var(--color-dark-400)',
  };

  const content = (
    <>
      <div
        className="border p-3.5"
        style={bubbleStyle}
        onClick={() => !isLastConvoMessageCurrentUser && setMessageId(message.message_id)}
      >
        <p className="wrap-break-word whitespace-pre-wrap">
          {message.content}
          {message.last_edited && <span className="text-light-800 text-sm"> (edited)</span>}
        </p>
      </div>
      {(isLastConvoMessageCurrentUser || messageId === message.message_id) && (
        <p className={`text-light-800 my-1 text-xs ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          Sent {formatTime(sentAt)}
        </p>
      )}
    </>
  );

  if (isPermittedToMessage) {
    return (
      <MessageContextMenu message={message} isCurrentUser={isCurrentUser}>
        {content}
      </MessageContextMenu>
    );
  }
  return content;
}

function DeletedMessageBubble({
  borderRadius,
  isCurrentUser,
  sentAt,
  message,
}: MessageBubbleProps) {
  return (
    <div
      className="col-start-2 row-start-2 border bg-transparent p-3.5 italic"
      style={{
        borderRadius: borderRadius,
        borderColor: isCurrentUser ? 'var(--color-primary)' : 'var(--color-dark-500)',
      }}
    >
      <div>{isCurrentUser ? 'You' : message.display_name} deleted a message</div>
      <p className="text-light-800 text-sm">{sentAt}</p>
    </div>
  );
}
