import { create } from 'zustand';

import type { Message } from '../../../../../../../types/message.types';

interface ReplyToState {
  replyTo: Message | null;
  setReplyTo: (message: Message) => void;
  clearReplyTo: () => void;
}

export const useReplyToStore = create<ReplyToState>()((set) => ({
  replyTo: null,
  setReplyTo: (message) => set({ replyTo: message }),
  clearReplyTo: () => set({ replyTo: null }),
}));
