import { DropdownMenu } from 'radix-ui';

import {
  useBlockUser,
  useUnblockUser,
} from '../../../../../../../../../../features/block/block.queries';
import IconButtonRounded from '../../../../../../../../IconButtonRounded';
import MoreIcon from '../../../../../../../_components/MoreIcon';

import BlockUserDialog from './_components/BlockUserDialog';

interface UserProfileDropdownMenuProps {
  userId: number;
  displayName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isBlocked: boolean;
}

export default function UserProfileDropdownMenu({
  userId,
  displayName,
  open,
  onOpenChange,
  isBlocked,
}: UserProfileDropdownMenuProps) {
  const block = useBlockUser();
  const unblock = useUnblockUser();

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <span>
          <IconButtonRounded className="bg-dark-600/60 hover:bg-dark-600/55">
            <MoreIcon />
          </IconButtonRounded>
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          alignOffset={5}
          className="bg-dark-500 border-dark-400 grid min-w-50 gap-3 overflow-hidden rounded-lg border-2 p-2 font-medium"
        >
          {isBlocked ? (
            <DropdownMenu.Item
              onClick={() => unblock.mutate(userId)}
              className="group data-highlighted:bg-dark-400 relative flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
            >
              <p className="text-md">Unblock</p>
            </DropdownMenu.Item>
          ) : (
            <BlockUserDialog onBlock={() => block.mutate(userId)} userToBlock={displayName}>
              <DropdownMenu.Item
                onSelect={(e) => e.preventDefault()}
                className="group data-highlighted:bg-danger-soft text-danger relative flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
              >
                <p className="text-md">Block</p>
              </DropdownMenu.Item>
            </BlockUserDialog>
          )}

          <DropdownMenu.Item
            onSelect={(e) => e.preventDefault()}
            className="group data-highlighted:bg-danger-soft text-danger relative flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
          >
            <p className="text-md">Report User Profile</p>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
