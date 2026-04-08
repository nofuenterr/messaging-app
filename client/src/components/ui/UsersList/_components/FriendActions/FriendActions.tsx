import { useNavigate } from 'react-router-dom';

import { useUnfriendUser } from '../../../../../features/friendship/friendship.queries';
import MessageIcon from '../../../../icons/MessageIcon';
import IconButtonRounded from '../../../IconButtonRounded';
import TooltipComponent from '../../../Tooltip';

import RemoveFriendIcon from './_components/RemoveFriendIcon';
import UnfriendUserDialog from './_components/UnfriendUserDialog';

interface FriendActionsProps {
  userId: number;
  friendName: string;
}

export default function FriendActions({ userId, friendName }: FriendActionsProps) {
  const navigate = useNavigate();
  const unfriendUser = useUnfriendUser();
  return (
    <>
      <TooltipComponent content="Message">
        <div onClick={(e) => e.stopPropagation()}>
          <IconButtonRounded
            onClick={() => navigate(`/users/${userId}/messages`)}
            className="hover:*:fill-info-hover"
          >
            <MessageIcon className="size-5" />
          </IconButtonRounded>
        </div>
      </TooltipComponent>
      <TooltipComponent content="Unfriend">
        <div onClick={(e) => e.stopPropagation()}>
          <UnfriendUserDialog
            onUnfriend={() => unfriendUser.mutate(userId)}
            userToUnfriend={friendName}
          >
            <IconButtonRounded>
              <RemoveFriendIcon />
            </IconButtonRounded>
          </UnfriendUserDialog>
        </div>
      </TooltipComponent>
    </>
  );
}
