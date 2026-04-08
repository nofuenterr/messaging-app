import { DropdownMenu } from 'radix-ui';

import { useUnfriendUser } from '../../../../../../../../../features/friendship/friendship.queries';
import FriendsIcon from '../../../../../../../../icons/FriendsIcon';
import IconButtonRounded from '../../../../../../../IconButtonRounded';

interface FriendDropdownMenuProps {
  userId: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FriendDropdownMenu({
  userId,
  open,
  onOpenChange,
}: FriendDropdownMenuProps) {
  const unfriend = useUnfriendUser();

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <span>
          <IconButtonRounded className="bg-dark-600/60 hover:bg-dark-600/55">
            <FriendsIcon className="size-5" />
          </IconButtonRounded>
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          alignOffset={5}
          className="bg-dark-500 border-dark-400 grid min-w-50 gap-3 overflow-hidden rounded-lg border-2 p-2 font-medium"
        >
          <DropdownMenu.Item
            onClick={() => unfriend.mutate(userId)}
            className="group data-highlighted:bg-danger-soft text-danger relative flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
          >
            <p className="text-md">Remove Friend</p>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
