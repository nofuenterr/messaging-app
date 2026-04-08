import { useParams } from 'react-router-dom';

import type { ConversationType } from '../../../../../../../../types/message.types';
import AvatarContainer from '../../../../../../components/ui/AvatarContainer';
import IconButton from '../../../../../../components/ui/IconButton';
import TooltipComponent from '../../../../../../components/ui/Tooltip';
import type { ProfileType, SideProfileState } from '../../../../../../hooks/useSideProfile';

import SidebarIcon from './_components/SidebarIcon';

interface ChatHeaderProps {
  avatar_color: string;
  avatar_url: string;
  conversation_name: string;
  conversation_type: ConversationType;
  activeSideProfile: SideProfileState;
  onToggleProfile: (id: number, type: ProfileType) => void;
  memberLabel?: string;
}

export default function ChatHeader({
  avatar_color,
  avatar_url,
  conversation_name,
  conversation_type,
  activeSideProfile,
  onToggleProfile,
  memberLabel,
}: ChatHeaderProps) {
  const params = useParams();
  const id = params.id ? Number(params.id) : undefined;
  const profileType: ProfileType = conversation_type === 'group' ? 'group' : 'user';
  const isSidebarActive = !!activeSideProfile.id;
  const tooltipContent =
    (isSidebarActive ? 'Hide ' : 'Show ') +
    (profileType === 'group' ? 'Group ' : 'User ') +
    'Profile';

  return (
    <header className="bg-dark-600 grid h-17 content-center px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="mr-auto flex cursor-pointer items-center gap-3 overflow-hidden"
          onClick={() => id !== undefined && onToggleProfile(id, profileType)}
        >
          <AvatarContainer
            avatarUrl={avatar_url}
            avatarColor={avatar_color}
            alt={`${conversation_name}'s avatar`}
            className="size-10"
          />

          <div className="min-w-0 overflow-hidden">
            <h3 className="min-w-0 truncate font-medium">{conversation_name}</h3>
            {profileType === 'group' && <p className="text-light-700 text-sm">{memberLabel}</p>}
          </div>
        </div>

        <TooltipComponent content={tooltipContent}>
          <IconButton
            onClick={() => id !== undefined && onToggleProfile(id, profileType)}
            className="flex-none bg-transparent p-1"
          >
            <SidebarIcon
              className={`${isSidebarActive ? '*:stroke-info' : '*:stroke-light-500 hover:*:stroke-light-900'}`}
            />
          </IconButton>
        </TooltipComponent>
      </div>
    </header>
  );
}
