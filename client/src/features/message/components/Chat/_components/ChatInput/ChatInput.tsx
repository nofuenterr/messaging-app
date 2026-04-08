import type { UseMutationResult } from '@tanstack/react-query';

import type { ConversationType } from '../../../../../../../../types/message.types';
import XIcon from '../../../../../../components/icons/XIcon';
import IconButtonRounded from '../../../../../../components/ui/IconButtonRounded';
import TooltipComponent from '../../../../../../components/ui/Tooltip';
import { useChatInputStore } from '../../store/useChatInput';
import { useMessageEditStore } from '../../store/useMessageEdit';
import { useReplyToStore } from '../../store/useReplyTo';

import GroupNotJoined from './_components/GroupNotJoined';
import MessageForm from './_components/MessageForm';
import UserBlocked from './_components/UserBlocked';

interface ChatInputProps<TVariables> {
  createMessage: UseMutationResult<unknown, Error, TVariables>;
  isBlocked?: boolean;
  isMember?: boolean;
  conversation_type: ConversationType;
}

export default function ChatInput<
  TVariables extends {
    content: string;
    reply_to_message_id?: number;
    message_type?: 'text' | 'system';
    system_event_type?: string;
  },
>({ createMessage, isBlocked, isMember, conversation_type }: ChatInputProps<TVariables>) {
  const { replyTo, clearReplyTo } = useReplyToStore();
  const { editingMessage, clearEditing } = useMessageEditStore();
  const { setValue } = useChatInputStore();

  return (
    <footer className="px-5 pb-5">
      {editingMessage && (
        <div className="border-t-dark-600 flex items-center gap-4 border-t pt-5">
          <div className="mr-auto">
            <p className="text-info font-semibold break-all">Edit Message</p>
            <p className="break-all">{editingMessage.content}</p>
          </div>
          <TooltipComponent content="Cancel Edit">
            <IconButtonRounded
              className="group"
              onClick={() => {
                clearEditing();
                setValue('');
              }}
            >
              <XIcon className="*:fill-light-500 group-hover:*:fill-light-900" />
            </IconButtonRounded>
          </TooltipComponent>
        </div>
      )}

      {!editingMessage && replyTo && (
        <div className="border-t-dark-600 flex items-center gap-4 border-t pt-5">
          <div className="mr-auto">
            <p className="text-info font-semibold break-all">
              Reply to <span>{replyTo.group_display_name ?? replyTo.display_name}</span>
            </p>
            <p className="break-all">{replyTo.content}</p>
          </div>
          <TooltipComponent content="Cancel Reply">
            <IconButtonRounded className="group" onClick={clearReplyTo}>
              <XIcon className="*:fill-light-500 group-hover:*:fill-light-900" />
            </IconButtonRounded>
          </TooltipComponent>
        </div>
      )}

      {conversation_type === 'group' ? (
        !isMember ? (
          <GroupNotJoined />
        ) : (
          <MessageForm createMessage={createMessage} />
        )
      ) : isBlocked ? (
        <UserBlocked />
      ) : (
        <MessageForm createMessage={createMessage} />
      )}
    </footer>
  );
}
