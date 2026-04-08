import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

import type { Message } from '../../../../../../../../types/message.types';
import type { User } from '../../../../../../../../types/user.types';
import ScrollArea from '../../../../../../components/ui/ScrollArea';
import type { ProfileType } from '../../../../../../hooks/useSideProfile';

import TextMessage from './_components/TextMessage';
import TimeSeparator from './_components/TimeSeparator';
import { shouldShowTimeSeparator } from './utils/index';

interface ChatListProps {
  messages: Message[];
  onToggleProfile: (id: number, type: ProfileType) => void;
  isPermittedToMessage: boolean;
}

export default function ChatList({
  messages,
  onToggleProfile,
  isPermittedToMessage,
}: ChatListProps) {
  const user = useOutletContext<User>();
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!messages.length) return;
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea viewportRef={viewportRef}>
      <section className="grid min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <ul className="flex flex-col-reverse gap-0">
          {messages.map((message, index) => {
            const previousMessage = messages[index + 1];
            const nextMessage = messages[index - 1];
            const showSeparator = shouldShowTimeSeparator(message, previousMessage);
            const isCurrentUser = message.author_id === user.id;
            const isLastConvoMessageCurrentUser = isCurrentUser && index === 0;

            return (
              <li key={message.message_id} className="flex w-full flex-col">
                {showSeparator && <TimeSeparator date={message.sent_at} />}
                {message.message_type !== 'text' ? (
                  <p className="w-full py-2 text-center break-all italic">{message.content}</p>
                ) : (
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} w-full`}>
                    <TextMessage
                      isCurrentUser={isCurrentUser}
                      messages={messages}
                      message={message}
                      index={index}
                      onToggleProfile={onToggleProfile}
                      isPermittedToMessage={isPermittedToMessage}
                      showSeparatorAbove={showSeparator}
                      nextMessageSeparator={
                        nextMessage ? shouldShowTimeSeparator(nextMessage, message) : false
                      }
                      currentUserId={user.id}
                      isLastConvoMessageCurrentUser={isLastConvoMessageCurrentUser}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </ScrollArea>
  );
}
