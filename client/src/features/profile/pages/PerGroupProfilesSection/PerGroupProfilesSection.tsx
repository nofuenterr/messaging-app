import { useQuery } from '@tanstack/react-query';
import { type Dispatch, type SetStateAction } from 'react';

import type { Group } from '../../../../../../types/group.types';
import type { User } from '../../../../../../types/user.types';
import { getUserGroups } from '../../../group/group.service';
import { getCurrentUserProfile } from '../../../user/user.service';
import type { ProfileSectionProps } from '../../profile.types';

import PerGroupProfilesContent from './PerGroupProfilesContent';

export default function PerGroupProfilesSection({
  unsavedChanges,
  setUnsavedChanges,
  flashWarning,
  setFlashWarning,
}: ProfileSectionProps & { setFlashWarning: Dispatch<SetStateAction<boolean>> }) {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useQuery<User>({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUserProfile,
    staleTime: Infinity,
  });

  const {
    data: groups,
    isLoading: isGroupsLoading,
    isError: isGroupsError,
    error: groupsError,
  } = useQuery<Group[]>({
    queryKey: ['groups', 'me'],
    queryFn: getUserGroups,
    staleTime: Infinity,
  });

  if (isUserLoading || isGroupsLoading)
    return (
      <div>
        <p>Loading per group profile…</p>
      </div>
    );
  if (isUserError || isGroupsError)
    return (
      <div>
        <p>{userError?.message ?? groupsError?.message}</p>
      </div>
    );
  if (!user || !groups) return null;
  if (!groups.length)
    return (
      <div>
        <p>You have no groups joined.</p>
      </div>
    );

  return (
    <PerGroupProfilesContent
      user={user}
      groups={groups}
      unsavedChanges={unsavedChanges}
      setUnsavedChanges={setUnsavedChanges}
      flashWarning={flashWarning}
      setFlashWarning={setFlashWarning}
    />
  );
}
