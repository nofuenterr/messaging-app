import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { Message, ConversationType } from '../../../../../../types/message.types';
import type { ProfileType, SideProfileState } from '../../../../hooks/useSideProfile';

import ChatHeader from './_components/ChatHeader/ChatHeader';
import ChatInput from './_components/ChatInput/ChatInput';
import ChatList from './_components/ChatList/ChatList';
import { useChatInputStore } from './store/useChatInput';
import { useMessageEditStore } from './store/useMessageEdit';
import { useReplyToStore } from './store/useReplyTo';

interface ChatContainerProps<TVariables> {
  avatar_color: string;
  avatar_url: string;
  conversation_name: string;
  messages: Message[];
  createMessage: UseMutationResult<unknown, Error, TVariables>;
  conversation_type: ConversationType;
  isMember?: boolean;
  isBlocked?: boolean;
  activeSideProfile: SideProfileState;
  onToggleProfile: (id: number, type: ProfileType) => void;
  memberLabel?: string;
}

export default function ChatContainer<
  TVariables extends {
    content: string;
    reply_to_message_id?: number;
    message_type?: 'text' | 'system';
    system_event_type?: string;
  },
>({
  avatar_color,
  avatar_url,
  conversation_name,
  messages,
  createMessage,
  conversation_type,
  isMember,
  isBlocked,
  activeSideProfile,
  onToggleProfile,
  memberLabel,
}: ChatContainerProps<TVariables>) {
  const { clearReplyTo } = useReplyToStore();
  const { clearEditing } = useMessageEditStore();
  const { reset } = useChatInputStore();
  const isPermittedToMessage =
    (conversation_type === 'direct' && !isBlocked) || (conversation_type === 'group' && !!isMember);

  useEffect(() => {
    return () => {
      clearReplyTo();
      clearEditing();
      reset();
    };
  }, [clearReplyTo, clearEditing, reset]);

  return (
    <article className="bg-dark-700 flex h-dvh flex-col">
      <ChatHeader
        avatar_color={avatar_color}
        avatar_url={avatar_url}
        conversation_name={conversation_name}
        conversation_type={conversation_type}
        activeSideProfile={activeSideProfile}
        onToggleProfile={onToggleProfile}
        memberLabel={memberLabel}
      />
      <ChatList
        messages={messages}
        onToggleProfile={onToggleProfile}
        isPermittedToMessage={isPermittedToMessage}
      />
      <ChatInput
        createMessage={createMessage}
        isBlocked={isBlocked}
        isMember={isMember}
        conversation_type={conversation_type}
      />
    </article>
  );
}
