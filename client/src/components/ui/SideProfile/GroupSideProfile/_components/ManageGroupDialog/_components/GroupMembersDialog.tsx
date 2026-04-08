import { Dialog, VisuallyHidden } from 'radix-ui';
import { type ReactNode } from 'react';

import type { GroupDetail, GroupMember } from '../../../../../../../../../types/group.types';
import AvatarContainer from '../../../../../AvatarContainer';
import DialogCloseButton from '../../../../../DialogCloseButton';
import IconButtonRounded from '../../../../../IconButtonRounded';
import ScrollArea from '../../../../../ScrollArea';
import MoreIcon from '../../../../_components/MoreIcon';

import GroupMemberDropdownMenu from './_components/GroupMemberDropdownMenu';

interface GroupMembersDialogProps {
  children: ReactNode;
  groupId: number;
  members: GroupDetail['members'];
  membership: GroupDetail['membership'];
  title: string;
  dialogKey: 'administrators' | 'members';
}

export default function GroupMembersDialog({
  children,
  groupId,
  members,
  membership,
  title,
  dialogKey,
}: GroupMembersDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 duration-150" />

        <Dialog.Content className="bg-dark-500 border-dark-400 fixed top-1/2 left-1/2 z-110 grid max-h-[85vh] min-h-[70vh] w-full max-w-120 -translate-1/2 grid-rows-[auto_1fr_auto] gap-6 rounded-2xl border p-6 duration-150 focus:outline-none">
          <Dialog.Title className="mt-4 text-2xl font-bold">{title}</Dialog.Title>

          <VisuallyHidden.Root>
            <Dialog.Description>Perform operations for group {dialogKey} here.</Dialog.Description>
          </VisuallyHidden.Root>

          <ScrollArea scrollbarClassName="translate-x-6">
            <ul className="grid min-h-0 gap-4 overflow-y-auto">
              {members.map((member: GroupMember) => {
                const canManage =
                  (member.membership_role === 'member' &&
                    membership?.membership_role !== 'member') ||
                  (member.membership_role === 'admin' && membership?.membership_role === 'owner');

                return (
                  <li key={member.id} className="flex items-center gap-4 overflow-hidden">
                    <AvatarContainer
                      avatarUrl={member.avatar_url}
                      avatarColor={member.avatar_color}
                      alt={`${member.group_display_name}'s avatar`}
                    />

                    <span className="truncate">{member.group_display_name}</span>

                    <span className="bg-info ml-auto rounded-full px-1.5 py-0.5 text-sm font-medium">
                      {member.membership_role}
                    </span>

                    {canManage && (
                      <GroupMemberDropdownMenu
                        groupId={groupId}
                        member={member}
                        membership={membership}
                      >
                        <IconButtonRounded className="hover:bg-dark-600">
                          <MoreIcon />
                        </IconButtonRounded>
                      </GroupMemberDropdownMenu>
                    )}
                  </li>
                );
              })}
            </ul>
          </ScrollArea>

          <Dialog.Close asChild className="mt-auto justify-self-end">
            <button
              type="button"
              className="cursor-pointer text-lg font-semibold hover:underline"
              aria-label="Close"
            >
              Close
            </button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <span>
              <DialogCloseButton />
            </span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
