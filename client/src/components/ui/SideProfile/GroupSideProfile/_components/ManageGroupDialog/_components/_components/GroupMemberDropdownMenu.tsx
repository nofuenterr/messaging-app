import { DropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

import type { GroupMember, GroupMembership } from '../../../../../../../../../../types/group.types';
import {
  useKickUser,
  useSetGroupAdminAsMember,
  useSetGroupMemberAsAdmin,
} from '../../../../../../../../features/group/group.queries';

interface GroupMemberDropdownMenuProps {
  children: ReactNode;
  groupId: number;
  member: GroupMember;
  membership: GroupMembership | null;
}

export default function GroupMemberDropdownMenu({
  children,
  groupId,
  member,
  membership,
}: GroupMemberDropdownMenuProps) {
  const setGroupMemberAsAdmin = useSetGroupMemberAsAdmin(groupId);
  const setGroupAdminAsMember = useSetGroupAdminAsMember(groupId);
  const kickMember = useKickUser(groupId);

  const kickUserPermission =
    (member.membership_role === 'member' && membership?.membership_role !== 'member') ||
    (member.membership_role === 'admin' && membership?.membership_role === 'owner');
  const setGroupMemberAsAdminPermission =
    member.membership_role === 'member' && membership?.membership_role !== 'member';
  const setGroupAdminAsMemberPermission =
    member.membership_role === 'admin' && membership?.membership_role === 'owner';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span>{children}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-dark-500 border-dark-400 z-140 grid min-w-50 gap-3 overflow-hidden rounded-lg border-2 p-2 font-medium"
          sideOffset={5}
        >
          {kickUserPermission && (
            <DropdownMenu.Item
              onClick={() => kickMember.mutate(member.id)}
              className="data-highlighted:bg-danger-soft text-danger flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
            >
              <p className="text-md">Kick User</p>
            </DropdownMenu.Item>
          )}

          {setGroupMemberAsAdminPermission && (
            <DropdownMenu.Item
              onClick={() => setGroupMemberAsAdmin.mutate(member.id)}
              className="group data-highlighted:bg-dark-400 relative flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
            >
              <p className="text-md">Set as admin</p>
            </DropdownMenu.Item>
          )}

          {setGroupAdminAsMemberPermission && (
            <DropdownMenu.Item
              onClick={() => setGroupAdminAsMember.mutate(member.id)}
              className="group data-highlighted:bg-dark-400 relative flex cursor-pointer items-center gap-3 rounded-md p-3 leading-none outline-none select-none"
            >
              <p className="text-md">Set as member</p>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
