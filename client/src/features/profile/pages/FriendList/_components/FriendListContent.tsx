import { useState } from 'react';

import ArticleWrapper from '../../../../../components/ui/ContentWrapper/_components/ArticleWrapper';
import ContentWrapper from '../../../../../components/ui/ContentWrapper/ContentWrapper';
import UserSideProfile from '../../../../../components/ui/SideProfile/UserSideProfile/UserSideProfile';
import type { ProfileType, SideProfileState } from '../../../../../hooks/useSideProfile';
import type { GroupedFriendships } from '../friendlist.types';

import AddFriendSection from './AddFriendSection';
import DirectionalSection from './DirectionalSection';
import FriendsSection from './FriendsSection';

interface FriendListContentProps {
  grouped: GroupedFriendships;
  hasPending: boolean;
  hasDeclined: boolean;
  sideProfile: SideProfileState;
  toggle: (id: number, type: ProfileType) => void;
}

type FriendSection = 'friends' | 'pending' | 'declined' | 'addFriend';

export default function FriendListContent({
  grouped,
  hasPending,
  hasDeclined,
  sideProfile,
  toggle,
}: FriendListContentProps) {
  const [section, setSection] = useState<FriendSection>(
    grouped.accepted.length > 0 ? 'friends' : 'addFriend'
  );

  return (
    <ContentWrapper>
      <ArticleWrapper>
        <div className="flex shrink-0 items-center gap-4">
          <SectionButton
            disabled={!grouped.accepted.length}
            title="Friends"
            onClick={() => setSection('friends')}
            active={section === 'friends'}
          />
          {hasPending && (
            <SectionButton
              title="Pending"
              onClick={() => setSection('pending')}
              active={section === 'pending'}
            />
          )}
          {hasDeclined && (
            <SectionButton
              title="Declined"
              onClick={() => setSection('declined')}
              active={section === 'declined'}
            />
          )}
          <SectionButton
            title="Add Friend"
            onClick={() => setSection('addFriend')}
            active={section === 'addFriend'}
            addFriend={true}
          />
        </div>

        {section === 'friends' && (
          <FriendsSection data={grouped.accepted} onToggle={(id) => toggle(id, 'user')} />
        )}
        {section === 'pending' && (
          <DirectionalSection
            incoming={grouped.pending.incoming}
            outgoing={grouped.pending.outgoing}
            status="pending"
            onToggle={(id) => toggle(id, 'user')}
          />
        )}
        {section === 'declined' && (
          <DirectionalSection
            incoming={grouped.declined.incoming}
            outgoing={grouped.declined.outgoing}
            status="declined"
            onToggle={(id) => toggle(id, 'user')}
          />
        )}
        {section === 'addFriend' && <AddFriendSection />}
      </ArticleWrapper>

      {sideProfile.id !== null && <UserSideProfile userId={sideProfile.id} />}
    </ContentWrapper>
  );
}

interface SectionButtonProps {
  title: string;
  active: boolean;
  onClick: () => void;
  addFriend?: boolean;
  disabled?: boolean;
}

function SectionButton({ title, active, onClick, addFriend, disabled }: SectionButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`bg-dark-500 disabled:bg-dark-700 disabled:text-light-700 cursor-pointer rounded-lg px-4 py-2 disabled:cursor-default ${active ? (addFriend ? 'bg-info' : 'bg-dark-500') : `${addFriend ? 'bg-info-soft hover:bg-info-hover' : 'hover:bg-dark-600 bg-transparent'} text-light-700 hover:text-light-900`}`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
    </button>
  );
}
