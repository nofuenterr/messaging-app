import type { MutualGroup } from './friendship.types';

export interface User {
  id: number;
  created: string;
  display_name: string | null;
  username: string;
  pronouns: string | null;
  bio: string | null;
  avatar_color: string;
  avatar_url: string;
  banner_url: string;
  user_role: 'admin' | 'user';
  deleted: string | null;
}

export interface UserProfile {
  user: User & {
    is_blocked: boolean;
    was_blocked: boolean;
    friendship_status: 'pending' | 'accepted' | 'declined' | null;
    request_direction: 'incoming' | 'outgoing' | null;
  };
  note: { content: string } | null;
  mutualGroups: MutualGroup[];
  mutualFriends: Omit<User, 'deleted'>[];
}
