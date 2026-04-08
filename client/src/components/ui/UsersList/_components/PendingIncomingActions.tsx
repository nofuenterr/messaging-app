import { useNavigate } from 'react-router-dom';

import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from '../../../../features/friendship/friendship.queries';
import CheckIcon from '../../../icons/CheckIcon';
import MessageIcon from '../../../icons/MessageIcon';
import XIcon from '../../../icons/XIcon';
import IconButtonRounded from '../../IconButtonRounded';
import TooltipComponent from '../../Tooltip';

export default function PendingIncomingActions({ userId }: { userId: number }) {
  const navigate = useNavigate();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();
  return (
    <>
      <TooltipComponent content="Message">
        <div onClick={(e) => e.stopPropagation()}>
          <IconButtonRounded onClick={() => navigate(`/users/${userId}/messages`)}>
            <MessageIcon className="size-5" />
          </IconButtonRounded>
        </div>
      </TooltipComponent>
      <TooltipComponent content="Accept">
        <div onClick={(e) => e.stopPropagation()}>
          <IconButtonRounded onClick={() => acceptRequest.mutate(userId)}>
            <CheckIcon />
          </IconButtonRounded>
        </div>
      </TooltipComponent>
      <TooltipComponent content="Decline">
        <div onClick={(e) => e.stopPropagation()}>
          <IconButtonRounded onClick={() => declineRequest.mutate(userId)}>
            <XIcon />
          </IconButtonRounded>
        </div>
      </TooltipComponent>
    </>
  );
}
