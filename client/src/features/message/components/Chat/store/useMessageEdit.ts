import { create } from 'zustand';

import type { Message } from '../../../../../../../types/message.types';

interface MessageEditState {
  editingMessage: Message | null;
  startEditing: (message: Message) => void;
  clearEditing: () => void;
}

export const useMessageEditStore = create<MessageEditState>()((set) => ({
  editingMessage: null,
  startEditing: (message) => set({ editingMessage: message }),
  clearEditing: () => set({ editingMessage: null }),
}));
