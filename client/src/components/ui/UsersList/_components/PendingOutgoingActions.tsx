import { useNavigate } from 'react-router-dom';

import { useUnfriendUser } from '../../../../features/friendship/friendship.queries';
import MessageIcon from '../../../icons/MessageIcon';
import XIcon from '../../../icons/XIcon';
import IconButtonRounded from '../../IconButtonRounded';
import TooltipComponent from '../../Tooltip';

export default function PendingOutgoingActions({ userId }: { userId: number }) {
  const navigate = useNavigate();
  const cancelRequest = useUnfriendUser();
  return (
    <>
      <TooltipComponent content="Message">
        <div onClick={(e) => e.stopPropagation()}>
          <IconButtonRounded onClick={() => navigate(`/users/${userId}/messages`)}>
            <MessageIcon className="size-5" />
          </IconButtonRounded>
        </div>
      </TooltipComponent>
      <TooltipComponent content="Cancel">
        <div onClick={(e) => e.stopPropagation()}>
          <IconButtonRounded onClick={() => cancelRequest.mutate(userId)}>
            <XIcon />
          </IconButtonRounded>
        </div>
      </TooltipComponent>
    </>
  );
}
