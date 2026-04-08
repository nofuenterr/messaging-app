import { isAxiosError } from 'axios';
import { Dialog, VisuallyHidden } from 'radix-ui';
import { useState, type ReactNode, type SubmitEvent } from 'react';

import type { GroupDetail, GroupMember } from '../../../../../../../../types/group.types';
import { useUpdateGroup } from '../../../../../../features/group/group.queries';
import UploadAvatarIcon from '../../../../../icons/UploadAvatarIcon';
import XIcon from '../../../../../icons/XIcon';
import AvatarContainer from '../../../../AvatarContainer';
import IconButtonRounded from '../../../../IconButtonRounded';
import ScrollArea from '../../../../ScrollArea';

import GroupMembersDialog from './_components/GroupMembersDialog';

interface ManageGroupDialogProps {
  manage: boolean;
  onClose: () => void;
  children: ReactNode;
  group: GroupDetail;
}

interface UpdateGroupServerErrors {
  group_name?: string;
  group_description?: string;
}

export default function ManageGroupDialog({
  manage,
  onClose,
  children,
  group,
}: ManageGroupDialogProps) {
  const { info, members, membership } = group;
  const [groupName, setGroupName] = useState(() => info.group_name);
  const [description, setDescription] = useState(() => info.group_description ?? '');
  const [avatarFile, setAvatarFile] = useState<File | string>(() => info.group_avatar_url ?? '');
  const [avatarPreview, setAvatarPreview] = useState(() => info.group_avatar_url ?? '');
  const [bannerFile, setBannerFile] = useState<File | string>('');
  const [bannerPreview, setBannerPreview] = useState(() => info.group_banner_url ?? '');

  const updateGroup = useUpdateGroup(info.group_id);

  const serverErrors = isAxiosError(updateGroup.error)
    ? (updateGroup.error.response?.data?.errors as UpdateGroupServerErrors)
    : undefined;

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const avatar_url = avatarFile ? avatarFile : avatarPreview;
    const banner_url = bannerFile ? bannerFile : bannerPreview;

    updateGroup.mutate(
      { group_name: groupName, group_description: description, avatar_url, banner_url },
      { onSuccess: onClose }
    );
  }

  function handleLabelKeyDown(e: React.KeyboardEvent<HTMLLabelElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.querySelector('input')?.click();
    }
  }

  const administrators = members.filter(
    (member: GroupMember) => member.membership_role !== 'member'
  );

  return (
    <Dialog.Root open={manage} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-dark-900/50 fixed inset-0 z-100 duration-150" />

        <Dialog.Content className="bg-dark-500 border-dark-400 fixed top-1/2 left-1/2 z-110 grid max-h-[85vh] w-full max-w-120 -translate-1/2 grid-rows-[1fr_auto] gap-5 overflow-hidden rounded-2xl border focus:outline-none has-data-[state=open]:invisible">
          <ScrollArea>
            <div className="grid min-h-0 gap-5 overflow-y-auto">
              <form onSubmit={handleSubmit} className="grid" id="updateGroupForm">
                <div className="relative grid h-40">
                  <label
                    className="group relative cursor-pointer bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundColor: info.group_avatar_color,
                      backgroundImage: `url(${bannerPreview})`,
                    }}
                  >
                    <div className="bg-dark-900/60 absolute inset-0 grid place-content-center justify-items-center text-center opacity-0 transition-opacity group-hover:opacity-100">
                      <UploadAvatarIcon />
                      <p className="text-light-700 text-sm font-bold">CHANGE BANNER</p>
                    </div>

                    <input
                      type="file"
                      name="banner_url"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setBannerFile(file);
                        setBannerPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>

                  <Dialog.Title className="bg-dark-600 absolute top-6 left-6 rounded-full px-3 py-1 text-xl font-semibold">
                    Edit group
                  </Dialog.Title>

                  <VisuallyHidden.Root>
                    <Dialog.Description>
                      Make changes to the group here. Click save when you&apos;re done.
                    </Dialog.Description>
                  </VisuallyHidden.Root>

                  {avatarFile ? (
                    <label
                      tabIndex={0}
                      onKeyDown={handleLabelKeyDown}
                      title={typeof avatarFile !== 'string' ? avatarFile.name : avatarFile}
                      className="border-dark-500 absolute inset-s-6 -inset-be-12 cursor-pointer rounded-full border-4 hover:opacity-95"
                    >
                      <div className="group relative size-24 rounded-full">
                        <AvatarContainer
                          className="size-24"
                          avatarUrl={avatarPreview}
                          avatarColor={info.group_avatar_color}
                          alt={`${info.group_name}'s avatar preview`}
                        />

                        <div className="bg-dark-900/60 absolute inset-0 grid place-content-center justify-items-center rounded-full text-center opacity-0 transition-opacity group-hover:opacity-100">
                          <UploadAvatarIcon />
                          <p className="text-light-700 text-sm font-bold">UPLOAD</p>
                        </div>
                      </div>

                      <input
                        type="file"
                        name="avatar_url"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                  ) : (
                    <label
                      tabIndex={0}
                      onKeyDown={handleLabelKeyDown}
                      title="No file chosen"
                      className="border-light-700 bg-dark-500 absolute inset-s-6 -inset-be-12 cursor-pointer rounded-full border-4 border-dashed"
                    >
                      <div className="relative grid size-24 place-content-center justify-items-center rounded-full text-center">
                        <UploadAvatarIcon />
                        <p className="text-light-700 text-sm font-bold">UPLOAD</p>
                        <div className="bg-info text-light-800 absolute top-0 right-0 grid size-6 place-content-center rounded-full text-2xl font-medium">
                          +
                        </div>
                      </div>
                      <input
                        type="file"
                        name="avatar_url"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="mt-15 grid gap-5 px-6">
                  <div className="grid gap-1">
                    <label className="grid gap-3">
                      <p className="text-lg font-semibold">Group name</p>
                      <input
                        autoComplete="off"
                        spellCheck={false}
                        type="text"
                        name="group_name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        maxLength={50}
                        className="border-dark-500 bg-dark-700 rounded-lg border p-3"
                      />
                    </label>
                    {serverErrors?.group_name && (
                      <p className="text-danger text-start text-sm">{serverErrors.group_name}</p>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <label className="grid gap-3">
                      <p className="text-lg font-semibold">Description</p>
                      <textarea
                        autoComplete="off"
                        spellCheck={false}
                        name="group_description"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={190}
                        className="border-dark-500 bg-dark-700 rounded-lg border p-3"
                      />
                    </label>
                    {serverErrors?.group_description && (
                      <p className="text-danger text-start text-sm">
                        {serverErrors.group_description}
                      </p>
                    )}
                  </div>
                </div>
              </form>

              <div className="grid gap-5 px-6">
                <GroupMembersDialog
                  groupId={info.group_id}
                  members={administrators}
                  membership={membership}
                  title="Administrators"
                  dialogKey="administrators"
                >
                  <button className="bg-dark-700 hover:bg-dark-600 flex cursor-pointer items-center justify-between rounded-lg p-3">
                    <span className="font-semibold">Administrators</span>
                    <span>{administrators.length}</span>
                  </button>
                </GroupMembersDialog>

                <GroupMembersDialog
                  groupId={info.group_id}
                  members={members}
                  membership={membership}
                  title="Members"
                  dialogKey="members"
                >
                  <button className="bg-dark-700 hover:bg-dark-600 flex cursor-pointer items-center justify-between rounded-lg p-3">
                    <span className="font-semibold">Members</span>
                    <span>{members.length}</span>
                  </button>
                </GroupMembersDialog>
              </div>
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between gap-4 p-6">
            <Dialog.Close asChild>
              <button
                type="button"
                className="cursor-pointer text-lg font-semibold hover:underline"
                aria-label="Cancel"
              >
                Close
              </button>
            </Dialog.Close>
            <button
              disabled={!groupName}
              type="submit"
              form="updateGroupForm"
              className="disabled:bg-info-soft disabled:text-light-700 bg-info hover:bg-info-hover min-w-35 cursor-pointer rounded-lg px-3 py-2 text-lg font-semibold disabled:cursor-not-allowed"
              aria-label="Save"
            >
              Save
            </button>
          </div>

          <Dialog.Close asChild>
            <IconButtonRounded className="bg-dark-500 absolute top-6 right-6">
              <XIcon className="*:fill-light-500 group-hover:*:fill-light-900" />
            </IconButtonRounded>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
