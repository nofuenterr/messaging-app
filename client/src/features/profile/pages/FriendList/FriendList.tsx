import type { Friendship } from '../../../../../../types/friendship.types';
import Error from '../../../../components/ui/Error';
import UsersListLoading from '../../../../components/ui/UsersListLoading';
import { useSideProfile } from '../../../../hooks/useSideProfile';
import { useFriendship } from '../../../friendship/friendship.queries';

import FriendListContent from './_components/FriendListContent';
import type { GroupedFriendships } from './friendlist.types';

export default function FriendList() {
  const { data: friendship, isLoading, isError, error } = useFriendship();
  const { sideProfile, toggle } = useSideProfile('user');

  if (isLoading) return <UsersListLoading title="Friends" />;
  if (isError) return <Error message={error?.message} />;

  const grouped: GroupedFriendships = {
    accepted: [],
    pending: { incoming: [], outgoing: [] },
    declined: { incoming: [], outgoing: [] },
  };

  (friendship as Friendship[]).forEach((fr) => {
    if (fr.friendship_status === 'accepted') {
      grouped.accepted.push(fr);
    } else if (fr.friendship_status === 'pending' || fr.friendship_status === 'declined') {
      grouped[fr.friendship_status][fr.request_direction].push(fr);
    }
  });

  const hasPending = grouped.pending.incoming.length > 0 || grouped.pending.outgoing.length > 0;
  const hasDeclined = grouped.declined.incoming.length > 0 || grouped.declined.outgoing.length > 0;

  return (
    <FriendListContent
      grouped={grouped}
      hasPending={hasPending}
      hasDeclined={hasDeclined}
      sideProfile={sideProfile}
      toggle={toggle}
    />
  );
}
