import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { UserProfile } from '../../../../../../../../../../../types/user.types';
import ChevronDownIcon from '../../../../../../../../icons/ChevronDown';
import AvatarContainer from '../../../../../../../../ui/AvatarContainer';

export default function MutualFriendsSection({
  friends,
}: {
  friends: UserProfile['mutualFriends'];
}) {
  const [active, setActive] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <section className="bg-dark-500 grid shrink-0 overflow-hidden rounded-lg">
      <div
        onClick={() => setActive(!active)}
        className="hover:bg-dark-400 flex cursor-pointer items-center justify-between px-3 py-2"
      >
        <h5 className="font-semibold">Mutual Friends — {friends.length}</h5>
        <ChevronDownIcon active={active} />
      </div>
      {active && (
        <ul className="overflow-hidden">
          {friends.map((user) => {
            return (
              <li
                key={user.id}
                onClick={() => navigate(`/users/${user.id}/messages`)}
                className="hover:bg-dark-400 cursor-pointer px-3 py-1"
              >
                <div className="flex items-center gap-3">
                  <AvatarContainer
                    avatarUrl={user.avatar_url}
                    avatarColor={user.avatar_color}
                    alt={`${user.display_name}'s avatar`}
                    className="size-8"
                  />
                  <p className="truncate font-medium">{user.display_name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
