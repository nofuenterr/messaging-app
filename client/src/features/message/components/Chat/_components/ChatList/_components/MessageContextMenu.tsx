import { ContextMenu } from 'radix-ui';
import type { ReactNode } from 'react';

import type { Message } from '../../../../../../../../../types/message.types';
import DeleteIcon from '../../../../../../../components/icons/DeleteIcon';
import EditIcon from '../../../../../../../components/icons/EditIcon';
import { useChatInputStore } from '../../../store/useChatInput';
import { useMessageEditStore } from '../../../store/useMessageEdit';
import { useReplyToStore } from '../../../store/useReplyTo';
import { useDeleteMessage } from '../hooks/useDeleteMessage';

import ReplyIcon from './ReplyIcon';

interface MessageContextMenuProps {
  children: ReactNode;
  className?: string;
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageContextMenu({
  children,
  className,
  message,
  isCurrentUser,
}: MessageContextMenuProps) {
  const { setReplyTo, clearReplyTo } = useReplyToStore();
  const { startEditing, clearEditing } = useMessageEditStore();
  const { setValue } = useChatInputStore();
  const { deleteMessage } = useDeleteMessage();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className={className}>
        <span className="contents">{children}</span>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          alignOffset={5}
          className="bg-dark-500 border-dark-400 z-100 grid min-w-50 gap-3 overflow-hidden rounded-lg border-2 p-2 font-medium"
        >
          {isCurrentUser && (
            <ContextMenu.Item
              onClick={() => {
                clearReplyTo();
                startEditing(message);
                setValue(message.content ?? '');
              }}
              className="group data-highlighted:bg-dark-400 flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
            >
              <EditIcon className="*:stroke-light-700 group-data-highlighted:*:stroke-light-900" />
              <p className="text-md">Edit Message</p>
            </ContextMenu.Item>
          )}

          <ContextMenu.Item
            onClick={() => {
              clearEditing();
              setValue('');
              setReplyTo(message);
            }}
            className="group data-highlighted:bg-dark-400 flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
          >
            <ReplyIcon className="*:fill-light-700 group-data-highlighted:*:fill-light-900" />
            <p className="text-md">Reply</p>
          </ContextMenu.Item>

          {isCurrentUser && (
            <>
              <ContextMenu.Separator className="bg-dark-400 h-0.5" />
              <ContextMenu.Item
                onClick={() => deleteMessage(message)}
                className="data-highlighted:bg-danger-soft text-danger flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
              >
                <DeleteIcon className="size-6" />
                <p className="text-md">Delete Message</p>
              </ContextMenu.Item>
            </>
          )}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
