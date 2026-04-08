import { DropdownMenu } from 'radix-ui';

import { useUnfriendUser } from '../../../../../../../../../../features/friendship/friendship.queries';
import IconButtonRounded from '../../../../../../../../IconButtonRounded';

import PendingRequestIcon from './_components/PendingRequestIcon';

interface OutgoingRequestDropdownMenuProps {
  userId: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function OutgoingRequestDropdownMenu({
  userId,
  open,
  onOpenChange,
}: OutgoingRequestDropdownMenuProps) {
  const cancel = useUnfriendUser();

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <span>
          <IconButtonRounded className="bg-dark-800/80 hover:bg-dark-800/75">
            <PendingRequestIcon className="*:fill-light-700" />
          </IconButtonRounded>
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          alignOffset={5}
          className="bg-dark-500 border-dark-400 grid min-w-50 gap-3 overflow-hidden rounded-lg border-2 p-2 font-medium"
        >
          <DropdownMenu.Item
            onClick={() => cancel.mutate(userId)}
            className="group data-highlighted:bg-dark-400 relative flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
          >
            <p className="text-md">Cancel Friend Request</p>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
