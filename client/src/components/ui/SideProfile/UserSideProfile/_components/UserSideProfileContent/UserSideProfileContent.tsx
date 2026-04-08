import { useEffect } from 'react';

import type { UserGroupProfile } from '../../../../../../../../types/group.types';
import type { User, UserProfile } from '../../../../../../../../types/user.types';
import { useShowUserProfileStore } from '../../../../../../stores/useShowUserProfile';
import type { UserSideProfileProps } from '../../UserSideProfile';

import HideUserProfile from './_components/HideUserProfile/HideUserProfile';
import ShowUserProfile from './_components/ShowUserProfile/ShowUserProfile';

interface UserSideProfileContentProps extends UserSideProfileProps {
  profile: UserProfile | UserGroupProfile;
  currentUser: User;
}

export default function UserSideProfileContent({
  userId,
  profile,
  currentUser,
}: UserSideProfileContentProps) {
  const { showUserProfile, setShowUserProfile } = useShowUserProfileStore();

  useEffect(() => {
    if (profile.user.is_blocked) setShowUserProfile(false);
  }, [profile, setShowUserProfile]);

  return showUserProfile ? (
    <ShowUserProfile userId={userId} profile={profile} currentUser={currentUser} />
  ) : (
    <HideUserProfile
      avatarUrl={profile.user.avatar_url}
      avatarColor={profile.user.avatar_color}
      displayName={profile.user.display_name ?? profile.user.username}
      setShowUserProfile={setShowUserProfile}
    />
  );
}
