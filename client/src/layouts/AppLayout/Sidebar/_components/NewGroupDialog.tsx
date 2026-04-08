import { isAxiosError } from 'axios';
import { Dialog } from 'radix-ui';
import { useState, type ReactNode, type SubmitEvent } from 'react';

import UploadAvatarIcon from '../../../../components/icons/UploadAvatarIcon';
import XIcon from '../../../../components/icons/XIcon';
import AvatarContainer from '../../../../components/ui/AvatarContainer';
import IconButton from '../../../../components/ui/IconButton';
import ScrollArea from '../../../../components/ui/ScrollArea';
import { useCreateGroup } from '../../../../features/group/group.queries';

interface NewGroupDialogProps {
  newGroupActive: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface NewGroupServerErrors {
  group_name?: string;
  group_description?: string;
}

export default function NewGroupDialog({ newGroupActive, onClose, children }: NewGroupDialogProps) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const createGroup = useCreateGroup();

  const serverErrors = isAxiosError(createGroup.error)
    ? (createGroup.error.response?.data?.errors as NewGroupServerErrors)
    : undefined;

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    createGroup.mutate(
      {
        group_name: groupName,
        group_description: description,
        avatar_url: avatarFile,
        avatar_color: '#FF0000',
      },
      {
        onSuccess: () => {
          onClose();
          handleReset();
        },
      }
    );
  }

  function handleReset() {
    setGroupName('');
    setDescription('');
    setAvatarFile('');
    setAvatarPreview('');
  }

  function handleLabelKeyDown(e: React.KeyboardEvent<HTMLLabelElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.querySelector('input')?.click();
    }
  }

  return (
    <Dialog.Root open={newGroupActive} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-dark-900/50 fixed inset-0 z-100 grid content-start overflow-y-auto duration-150" />

        <Dialog.Content className="bg-dark-500 border-dark-400 fixed top-1/2 left-1/2 z-100 grid max-h-[85vh] w-full max-w-120 -translate-1/2 grid-rows-[auto_1fr_auto] gap-3 rounded-2xl border p-6 duration-150 focus:outline-none">
          <div className="grid gap-3">
            <Dialog.Title className="mt-4 text-center text-2xl font-bold">
              Customize Your Group
            </Dialog.Title>

            <Dialog.Description className="text-light-800 text-center font-medium">
              Give your new group a personality with a name and an icon. You can always change it
              later.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 grid min-h-0 gap-4">
            <ScrollArea scrollbarClassName="translate-x-6">
              <fieldset className="grid min-h-0 flex-1 gap-4 overflow-y-auto">
                {typeof avatarFile !== 'string' ? (
                  <label
                    tabIndex={0}
                    onKeyDown={handleLabelKeyDown}
                    title={avatarFile.name}
                    className="cursor-pointer justify-self-center rounded-full"
                  >
                    <div className="group relative size-24 rounded-full">
                      <AvatarContainer
                        className="size-24"
                        avatarUrl={avatarPreview}
                        avatarColor="#00FFFF"
                        alt={'New group avatar preview'}
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
                    className="cursor-pointer justify-self-center rounded-full"
                  >
                    <div className="border-light-700 relative grid size-24 place-content-center justify-items-center rounded-full border border-dashed text-center">
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

                <div className="grid gap-1">
                  <label className="grid gap-3">
                    <p className="text-lg font-semibold">
                      Group Name <span className="text-danger">*</span>
                    </p>
                    <input
                      required
                      autoComplete="off"
                      spellCheck={false}
                      type="text"
                      name="group_name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      maxLength={50}
                      className="border-dark-400 bg-dark-600 rounded-lg border p-3"
                    />
                  </label>
                  {serverErrors?.group_name && (
                    <p className="text-danger text-start text-sm">{serverErrors.group_name}</p>
                  )}
                </div>

                <div className="grid gap-1">
                  <label className="grid gap-3">
                    <p className="text-lg font-semibold">Group Description (optional)</p>
                    <textarea
                      autoComplete="off"
                      spellCheck={false}
                      name="group_description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={190}
                      className="border-dark-400 bg-dark-600 rounded-lg border p-3"
                    />
                  </label>
                  {serverErrors?.group_description && (
                    <p className="text-danger text-start text-sm">
                      {serverErrors.group_description}
                    </p>
                  )}
                </div>
              </fieldset>
            </ScrollArea>

            <div className="mt-6 flex items-center justify-between gap-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="cursor-pointer text-lg font-semibold hover:underline"
                  aria-label="Back"
                >
                  Back
                </button>
              </Dialog.Close>

              <button
                disabled={!groupName}
                type="submit"
                className="bg-info hover:bg-info-hover disabled:bg-info-soft disabled:text-light-500 min-w-35 cursor-pointer rounded-lg px-3 py-2 text-lg font-semibold disabled:cursor-not-allowed"
                aria-label="Create"
              >
                Create
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <IconButton className="hover:*:stroke-light-900 hover:bg-dark-400 hover:border-dark-300 absolute top-3 right-3 border border-transparent bg-transparent p-3">
              <XIcon className="stroke-light-500" />
            </IconButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
