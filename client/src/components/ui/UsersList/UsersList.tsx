import { format } from 'date-fns';

import type { BlockedUser } from '../../../../../types/block.types';
import type {
  Friendship,
  FriendshipStatus,
  RequestDirection,
} from '../../../../../types/friendship.types';
import type { User } from '../../../../../types/user.types';
import Nameplate from '../Nameplate';
import ScrollAreaRoot from '../ScrollArea';

import AdminActions from './_components/AdminActions/AdminActions';
import BlockedActions from './_components/BlockedActions/BlockedActions';
import FriendActions from './_components/FriendActions/FriendActions';
import NotFriendActions from './_components/NotFriendActions';
import PendingIncomingActions from './_components/PendingIncomingActions';
import PendingOutgoingActions from './_components/PendingOutgoingActions';

type ListItem = Friendship & BlockedUser & User;
type UsersListType = 'friendship' | 'block' | 'users';

interface UsersListProps {
  list: Friendship[] | BlockedUser[] | User[];
  type: UsersListType;
  friendshipStatus?: FriendshipStatus;
  requestDirection?: RequestDirection;
  setSideProfile: (id: number | null) => void;
}

export default function UsersList({
  list,
  type,
  friendshipStatus,
  requestDirection,
  setSideProfile,
}: UsersListProps) {
  const dateKey =
    type === 'friendship' ? 'friendship_created' : type === 'block' ? 'blocked' : 'created';
  const idKey =
    type === 'friendship' ? 'other_user_id' : type === 'block' ? 'blocked_user_id' : 'id';

  return (
    <ScrollAreaRoot scrollbarClassName="translate-x-6">
      <ul className="grid overflow-y-auto">
        {(list as ListItem[]).map((item) => {
          const date = format(item[dateKey], 'MMM d, y');
          const userId = item[idKey] as number;
          const displayName = item.display_name ?? item.username;

          return (
            <li key={`${type}-${userId}`} className="*:border-dark-400 not-last:*:border-b">
              <Nameplate
                avatar_color={item.avatar_color}
                avatar_url={item.avatar_url}
                name={displayName}
                subname={item.username}
                date={date}
                onClick={() => {
                  // Get the current value from state - you'll need to update UsersListProps to include it
                  const newId = userId === null ? null : userId;
                  setSideProfile(newId);
                }}
              >
                {type === 'block' ? (
                  <BlockedActions userId={userId} />
                ) : type === 'friendship' ? (
                  friendshipStatus === 'accepted' ? (
                    <FriendActions userId={userId} friendName={displayName} />
                  ) : friendshipStatus === 'pending' ? (
                    requestDirection === 'incoming' ? (
                      <PendingIncomingActions userId={userId} />
                    ) : (
                      <PendingOutgoingActions userId={userId} />
                    )
                  ) : (
                    <NotFriendActions userId={userId} />
                  )
                ) : (
                  <AdminActions userId={userId} displayName={displayName} />
                )}
              </Nameplate>
            </li>
          );
        })}
      </ul>
    </ScrollAreaRoot>
  );
}
