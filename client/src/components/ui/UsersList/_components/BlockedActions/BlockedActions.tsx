import { useUnblockUser } from '../../../../../features/block/block.queries';
import { useShowUserProfileStore } from '../../../../../stores/useShowUserProfile';
import IconButtonRounded from '../../../IconButtonRounded';
import TooltipComponent from '../../../Tooltip';

import UnblockIcon from './_components/UnblockIcon';

export default function BlockedActions({ userId }: { userId: number }) {
  const unblockUser = useUnblockUser();
  const { setShowUserProfile } = useShowUserProfileStore();

  return (
    <TooltipComponent content="Unblock">
      <div onClick={(e) => e.stopPropagation()}>
        <IconButtonRounded
          onClick={() => {
            unblockUser.mutate(userId);
            setShowUserProfile(true);
          }}
        >
          <UnblockIcon />
        </IconButtonRounded>
      </div>
    </TooltipComponent>
  );
}
