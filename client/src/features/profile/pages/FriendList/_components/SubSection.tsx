import { useState } from 'react';

import type {
  Friendship,
  FriendshipStatus,
  RequestDirection,
} from '../../../../../../../types/friendship.types';
import ChevronDownIcon from '../../../../../components/icons/ChevronDown';
import UsersList from '../../../../../components/ui/UsersList/UsersList';

interface SubSectionProps {
  list: Friendship[];
  heading: string;
  status: FriendshipStatus;
  direction: RequestDirection;
  onToggle: (id: number) => void;
}

export default function SubSection({
  list,
  heading,
  status,
  direction,
  onToggle,
}: SubSectionProps) {
  const [activeSubSection, setActiveSubSection] = useState<boolean>(true);

  return (
    <div>
      <div
        onClick={() => setActiveSubSection((prev) => !prev)}
        className="hover:bg-dark-600 mb-4 flex cursor-pointer items-center justify-between"
      >
        <h4 className="font-semibold">
          {heading} — {list.length}
        </h4>
        <ChevronDownIcon active={activeSubSection} />
      </div>
      {activeSubSection ? <hr className="text-dark-400" /> : null}
      {activeSubSection ? (
        <UsersList
          list={list}
          type="friendship"
          friendshipStatus={status}
          requestDirection={direction}
          setSideProfile={(id) => id !== null && onToggle(id)}
        />
      ) : null}
    </div>
  );
}
