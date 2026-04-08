import { useQuery } from '@tanstack/react-query';

import type { User } from '../../../../../../types/user.types';
import { getCurrentUserProfile } from '../../../user/user.service';
import type { ProfileSectionProps } from '../../profile.types';

import MainProfileContent from './MainProfileContent';

export default function MainProfileSection({
  unsavedChanges,
  setUnsavedChanges,
  flashWarning,
}: ProfileSectionProps) {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User>({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUserProfile,
    staleTime: Infinity,
  });

  if (isLoading)
    return (
      <div>
        <p>Loading user profile…</p>
      </div>
    );
  if (isError)
    return (
      <div>
        <p>{error?.message}</p>
      </div>
    );
  if (!user) return null;

  return (
    <MainProfileContent
      user={user}
      unsavedChanges={unsavedChanges}
      setUnsavedChanges={setUnsavedChanges}
      flashWarning={flashWarning}
    />
  );
}
