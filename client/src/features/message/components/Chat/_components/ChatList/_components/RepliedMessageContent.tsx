import type { Message } from '../../../../../../../../../types/message.types';

interface RepliedMessageProps {
  isCurrentUser: boolean;
  message: Message;
}

export function RepliedMessage({ isCurrentUser, message }: RepliedMessageProps) {
  return (
    <div
      className="inline-block max-w-[20rem] rounded-2xl border p-2.5"
      style={{
        backgroundColor: isCurrentUser ? 'var(--color-primary-hover)' : 'var(--color-dark-600)',
        borderColor: isCurrentUser ? 'var(--color-success)' : 'var(--color-dark-400)',
      }}
    >
      <p className="truncate">{message.replied_message_content}</p> {/* no text-sm */}
    </div>
  );
}

export function DeletedRepliedMessage({ isCurrentUser, message }: RepliedMessageProps) {
  return (
    <div
      className="inline-block max-w-[20rem] rounded-2xl border p-2.5 italic"
      style={{
        borderColor: isCurrentUser ? 'var(--color-primary)' : 'var(--color-dark-500)',
      }}
    >
      <p className="text-light-700">
        {isCurrentUser ? 'You' : message.replied_message_author_name} deleted a message
      </p>
    </div>
  );
}
