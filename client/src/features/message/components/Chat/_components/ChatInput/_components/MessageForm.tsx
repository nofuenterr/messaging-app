import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef, type SubmitEvent } from 'react';

import TooltipComponent from '../../../../../../../components/ui/Tooltip';
import { useChatInputStore } from '../../../store/useChatInput';
import { useMessageEditStore } from '../../../store/useMessageEdit';
import { useReplyToStore } from '../../../store/useReplyTo';
import { useEditMessage } from '../hooks/useEditMessage';

import SendMessageIcon from './SendMessageIcon';

export default function MessageForm<
  TVariables extends {
    content: string;
    reply_to_message_id?: number;
    message_type?: 'text' | 'system';
    system_event_type?: string;
  },
>({ createMessage }: { createMessage: UseMutationResult<unknown, Error, TVariables> }) {
  const { replyTo, clearReplyTo } = useReplyToStore();
  const { editingMessage } = useMessageEditStore();
  const { value, setValue, reset } = useChatInputStore();
  const { submitEdit } = useEditMessage();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (replyTo || editingMessage) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [replyTo, editingMessage]);

  useEffect(() => {
    setValue(editingMessage?.content ?? '');
  }, [setValue, editingMessage]);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const content = value.trim();
    if (!content) return;

    if (editingMessage) {
      submitEdit(content);
    } else {
      createMessage.mutate({ content, reply_to_message_id: replyTo?.message_id } as TVariables, {
        onSuccess: () => {
          reset();
          clearReplyTo();
        },
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="flex items-center gap-4 pt-5">
      <input
        ref={inputRef}
        autoFocus
        required
        autoComplete="off"
        spellCheck={false}
        type="text"
        name="content"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-dark-900 border-dark-600 flex-1 rounded-full border px-5 py-3 font-semibold outline-none"
        placeholder={editingMessage ? 'Edit message...' : 'Type a message'}
      />
      <TooltipComponent content="Send Message">
        <button
          disabled={!value || createMessage.isPending}
          type="submit"
          className="group grid size-10 cursor-pointer place-content-center rounded-full disabled:cursor-not-allowed"
        >
          <SendMessageIcon />
        </button>
      </TooltipComponent>
    </form>
  );
}
