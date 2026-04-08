import { create } from 'zustand';

interface ChatInputState {
  value: string;
  setValue: (value: string) => void;
  reset: () => void;
}

export const useChatInputStore = create<ChatInputState>()((set) => ({
  value: '',
  setValue: (value) => set({ value }),
  reset: () => set({ value: '' }),
}));
