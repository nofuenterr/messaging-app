import { DropdownMenu } from 'radix-ui';

import { useAcceptFriendRequest } from '../../../../../../../../../../features/friendship/friendship.queries';
import IconButtonRounded from '../../../../../../../../IconButtonRounded';

import PendingRequestIcon from './_components/PendingRequestIcon';

interface IncomingRequestDropdownMenuProps {
  userId: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function IncomingRequestDropdownMenu({
  userId,
  open,
  onOpenChange,
}: IncomingRequestDropdownMenuProps) {
  const accept = useAcceptFriendRequest();

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <span>
          <IconButtonRounded className="bg-dark-600/60 hover:bg-dark-600/55">
            <PendingRequestIcon />
          </IconButtonRounded>
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          alignOffset={5}
          className="bg-dark-500 border-dark-400 grid min-w-50 gap-3 overflow-hidden rounded-lg border-2 p-2 font-medium"
        >
          <DropdownMenu.Item
            onClick={() => accept.mutate(userId)}
            className="group data-highlighted:bg-dark-400 relative flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
          >
            <p className="text-md">Accept Friend Request</p>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
