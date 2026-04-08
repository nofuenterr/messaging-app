import { useState, useCallback } from 'react';

export type ProfileType = 'user' | 'group';

export interface SideProfileState {
  id: number | null;
  type: ProfileType;
}

interface UseSideProfileReturn {
  sideProfile: SideProfileState;
  setSideProfile: (state: SideProfileState) => void;
  toggle: (id: number, type: ProfileType) => void;
  close: () => void;
}

export function useSideProfile(
  defaultType: ProfileType = 'user',
  initialId: number | null | undefined = null
): UseSideProfileReturn {
  const [sideProfile, setSideProfile] = useState<SideProfileState>({
    id: initialId ?? null,
    type: defaultType,
  });

  const toggle = useCallback((id: number, type: ProfileType) => {
    setSideProfile((prev) => {
      const isSame = prev.id === id && prev.type === type;
      return isSame ? { id: null, type } : { id, type };
    });
  }, []);

  const close = useCallback(() => {
    setSideProfile((prev) => ({ ...prev, id: null }));
  }, []);

  return { sideProfile, setSideProfile, toggle, close };
}
