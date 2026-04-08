import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { UserGroupProfile } from '../../../../../../../../../../types/group.types';
import type { User, UserProfile } from '../../../../../../../../../../types/user.types';
import { useSendFriendRequest } from '../../../../../../../../features/friendship/friendship.queries';
import AddFriendIcon from '../../../../../../../icons/AddFriendIcon';
import MessageIcon from '../../../../../../../icons/MessageIcon';
import AvatarContainer from '../../../../../../AvatarContainer';
import IconButtonRounded from '../../../../../../IconButtonRounded';
import ScrollArea from '../../../../../../ScrollArea';
import TooltipComponent from '../../../../../../Tooltip';
import SideProfileWrapper from '../../../../../_components/SideProfileWrapper';

import BlockedSection from './_components/BlockedSection';
import FriendDropdownMenu from './_components/FriendDropdownMenu';
import MutualFriendsSection from './_components/MutualFriendsSection';
import MutualGroupsSection from './_components/MutualGroupsSection';
import NoteSection from './_components/NoteSection';
import PendingIncomingSection from './_components/PendingIncomingSection';
import IncomingRequestDropdownMenu from './_components/PendingRequest/IncomingRequestDropdownMenu';
import OutgoingRequestDropdownMenu from './_components/PendingRequest/OutgoingRequestDropdownMenu';
import UserProfileDropdownMenu from './_components/UserProfileDropdownMenu/UserProfileDropdownMenu';

interface ShowUserProfileProps {
  userId: number;
  profile: UserProfile | UserGroupProfile;
  currentUser: User;
}

export default function ShowUserProfile({ userId, profile, currentUser }: ShowUserProfileProps) {
  const [dropdownOpen, setDropdownOpen] = useState<null | 'more' | 'friendship'>(null);
  const [tooltipOpen, setTooltipOpen] = useState<null | 'more' | 'friendship'>(null);
  const addFriend = useSendFriendRequest();
  const navigate = useNavigate();

  const { user, note, mutualGroups, mutualFriends } = profile;

  const displayName = user.display_name ?? user.username;
  const userCreatedAt = format(user.created, 'MMM d, y');
  const isCurrentUser = currentUser.id === user.id;

  const handleDropdownChange = (key: 'more' | 'friendship') => (open: boolean) => {
    setDropdownOpen(open ? key : null);
    if (open) setTooltipOpen(null);
  };

  return (
    <SideProfileWrapper>
      <div className="shrink-0">
        <div
          className="relative grid h-30 content-start justify-end bg-cover bg-center bg-no-repeat p-4"
          style={{ backgroundColor: user.avatar_color, backgroundImage: `url(${user.banner_url})` }}
        >
          {!isCurrentUser && (
            <div className="flex items-center gap-2">
              <TooltipComponent content="Message">
                <IconButtonRounded
                  className="bg-dark-600/60 hover:bg-dark-600/55"
                  onClick={() => navigate(`/users/${userId}/messages`)}
                >
                  <MessageIcon className="group-hover:*:fill-light-900 size-5" />
                </IconButtonRounded>
              </TooltipComponent>

              {(!user.friendship_status || user.friendship_status === 'declined') && (
                <TooltipComponent
                  content="Add Friend"
                  open={tooltipOpen === 'friendship' && !dropdownOpen}
                  onOpenChange={(o) => !dropdownOpen && setTooltipOpen(o ? 'friendship' : null)}
                >
                  <IconButtonRounded
                    onClick={() => addFriend.mutate(userId)}
                    className="bg-dark-600/60 hover:bg-dark-600/55"
                  >
                    <AddFriendIcon className="" />
                  </IconButtonRounded>
                </TooltipComponent>
              )}

              {user.friendship_status === 'pending' && user.request_direction === 'outgoing' && (
                <TooltipComponent
                  content="Outgoing Friend Request"
                  open={tooltipOpen === 'friendship' && !dropdownOpen}
                  onOpenChange={(o) => !dropdownOpen && setTooltipOpen(o ? 'friendship' : null)}
                >
                  <OutgoingRequestDropdownMenu
                    open={dropdownOpen === 'friendship'}
                    onOpenChange={handleDropdownChange('friendship')}
                    userId={userId}
                  />
                </TooltipComponent>
              )}

              {user.friendship_status === 'pending' && user.request_direction === 'incoming' && (
                <TooltipComponent
                  content="Incoming Friend Request"
                  open={tooltipOpen === 'friendship' && !dropdownOpen}
                  onOpenChange={(o) => !dropdownOpen && setTooltipOpen(o ? 'friendship' : null)}
                >
                  <IncomingRequestDropdownMenu
                    open={dropdownOpen === 'friendship'}
                    onOpenChange={handleDropdownChange('friendship')}
                    userId={userId}
                  />
                </TooltipComponent>
              )}

              {user.friendship_status === 'accepted' && (
                <TooltipComponent
                  content="Friends"
                  open={tooltipOpen === 'friendship' && !dropdownOpen}
                  onOpenChange={(o) => !dropdownOpen && setTooltipOpen(o ? 'friendship' : null)}
                >
                  <FriendDropdownMenu
                    open={dropdownOpen === 'friendship'}
                    onOpenChange={handleDropdownChange('friendship')}
                    userId={userId}
                  />
                </TooltipComponent>
              )}

              <TooltipComponent
                content="More"
                open={tooltipOpen === 'more' && !dropdownOpen}
                onOpenChange={(o) => !dropdownOpen && setTooltipOpen(o ? 'more' : null)}
              >
                <UserProfileDropdownMenu
                  open={dropdownOpen === 'more'}
                  onOpenChange={handleDropdownChange('more')}
                  userId={userId}
                  displayName={displayName}
                  isBlocked={user.is_blocked}
                />
              </TooltipComponent>
            </div>
          )}

          <AvatarContainer
            avatarUrl={user.avatar_url}
            avatarColor={user.avatar_color}
            alt={`${displayName}'s avatar`}
            className="border-dark-600 absolute inset-s-4 -inset-be-12 size-24 rounded-full border-4"
          />
        </div>

        <header className="mt-10 overflow-hidden p-4">
          <h4 className="line-clamp-2 overflow-hidden text-2xl font-bold wrap-break-word whitespace-normal">
            {displayName}
          </h4>

          <div className="mt-1 flex flex-wrap font-medium break-all">
            <p className="mr-1">{user.username}</p>
            {user.pronouns ? <p> • {user.pronouns}</p> : null}
          </div>

          {user.bio && !user.was_blocked && (
            <pre className="mt-4 line-clamp-3 overflow-hidden text-wrap wrap-break-word whitespace-normal">
              {user.bio}
            </pre>
          )}
        </header>
      </div>

      <ScrollArea>
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-4">
          {!isCurrentUser && (
            <>
              {user.is_blocked ? (
                <BlockedSection userId={user.id} />
              ) : user.friendship_status === 'pending' && user.request_direction === 'incoming' ? (
                <PendingIncomingSection userId={user.id} senderName={displayName} />
              ) : null}
            </>
          )}

          <section className="bg-dark-500 grid rounded-lg px-3 py-2">
            <h5 className="font-semibold">Created since:</h5>
            <p>{userCreatedAt}</p>
          </section>

          {!isCurrentUser && !user.was_blocked && (
            <>
              {mutualGroups.length > 0 && <MutualGroupsSection groups={mutualGroups} />}

              {mutualFriends.length > 0 && <MutualFriendsSection friends={mutualFriends} />}
            </>
          )}

          <NoteSection key={userId} userId={userId} note={note} />
        </div>
      </ScrollArea>
    </SideProfileWrapper>
  );
}
