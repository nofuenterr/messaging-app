import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';

import { useUserGroupProfile } from '../../../../features/group/group.queries';
import { useUserProfile } from '../../../../features/user/user.queries';
import { getCurrentUserProfile } from '../../../../features/user/user.service';
import SideProfileLoading from '../_components/SideProfileLoading';
import SideProfileWrapper from '../_components/SideProfileWrapper';

import UserSideProfileContent from './_components/UserSideProfileContent/UserSideProfileContent';

export interface UserSideProfileProps {
  userId: number;
}

export default function UserSideProfile({ userId }: UserSideProfileProps) {
  const location = useLocation();
  const params = useParams();
  const isGroupConvo = location.pathname.startsWith('/groups');
  const groupId = Number(params.id);

  const userProfileQuery = useUserProfile(userId);
  const groupProfileQuery = useUserGroupProfile(groupId, userId);

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErr,
  } = isGroupConvo ? groupProfileQuery : userProfileQuery;

  const {
    data: currentUser,
    isLoading: currentUserLoading,
    isError: currentUserError,
    error: currentUserErr,
  } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUserProfile,
    staleTime: Infinity,
  });

  if (profileLoading || currentUserLoading) return <SideProfileLoading />;
  if (profileError || currentUserError) {
    return (
      <SideProfileWrapper>
        <p className="flex-1 place-content-center text-center text-xl font-semibold text-balance">
          {profileErr?.message ?? currentUserErr?.message}
        </p>
      </SideProfileWrapper>
    );
  }

  return <UserSideProfileContent userId={userId} profile={profile} currentUser={currentUser} />;
}
