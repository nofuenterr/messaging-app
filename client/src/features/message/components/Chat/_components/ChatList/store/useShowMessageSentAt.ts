import { create } from 'zustand';

interface ShowMessageSentAtState {
  messageId: number | null;
  setMessageId: (messageId: number) => void;
}

export const useShowMessageSentAtStore = create<ShowMessageSentAtState>()((set) => ({
  messageId: null,
  setMessageId: (messageId: number) =>
    set((state) => ({
      messageId: state.messageId !== messageId ? messageId : null,
    })),
}));
