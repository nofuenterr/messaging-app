import type { Friendship } from '../../../../../../types/friendship.types';

export interface GroupedFriendships {
  accepted: Friendship[];
  pending: { incoming: Friendship[]; outgoing: Friendship[] };
  declined: { incoming: Friendship[]; outgoing: Friendship[] };
}
