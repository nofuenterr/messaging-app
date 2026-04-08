import { create } from 'zustand';

interface ShowUserProfileState {
  showUserProfile: boolean;
  setShowUserProfile: (show: boolean) => void;
}

export const useShowUserProfileStore = create<ShowUserProfileState>()((set) => ({
  showUserProfile: true,
  setShowUserProfile: (show: boolean) => set({ showUserProfile: show }),
}));
