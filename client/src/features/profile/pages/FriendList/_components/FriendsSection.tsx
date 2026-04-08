import type { Friendship } from '../../../../../../../types/friendship.types';
import UsersList from '../../../../../components/ui/UsersList/UsersList';

interface FriendsSectionProps {
  data: Friendship[];
  onToggle: (id: number) => void;
}

export default function FriendsSection({ data, onToggle }: FriendsSectionProps) {
  if (!data.length)
    return (
      <div className="grid flex-1">
        <p className="bg-dark-500 place-self-center rounded-full px-4 py-2 text-xl font-semibold -tracking-tight">
          You currently have no friends
        </p>
      </div>
    );

  return (
    <section className="min-h-0">
      <UsersList
        list={data}
        type="friendship"
        friendshipStatus="accepted"
        setSideProfile={(id) => id !== null && onToggle(id)}
      />
    </section>
  );
}
