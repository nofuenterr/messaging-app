import { useNavigate } from 'react-router-dom';

import { useSendFriendRequest } from '../../../../features/friendship/friendship.queries';
import AddFriendIcon from '../../../icons/AddFriendIcon';
import MessageIcon from '../../../icons/MessageIcon';
import IconButton from '../../IconButton';
import TooltipComponent from '../../Tooltip';

export default function NotFriendActions({ userId }: { userId: number }) {
  const navigate = useNavigate();
  const sendRequest = useSendFriendRequest();
  return (
    <>
      <TooltipComponent content="Message">
        <div onClick={(e) => e.stopPropagation()}>
          <IconButton onClick={() => navigate(`/users/${userId}/messages`)}>
            <MessageIcon className="size-5" />
          </IconButton>
        </div>
      </TooltipComponent>
      <TooltipComponent content="Add Friend">
        <div onClick={(e) => e.stopPropagation()}>
          <IconButton onClick={() => sendRequest.mutate(userId)}>
            <AddFriendIcon className="size-5" />
          </IconButton>
        </div>
      </TooltipComponent>
    </>
  );
}
