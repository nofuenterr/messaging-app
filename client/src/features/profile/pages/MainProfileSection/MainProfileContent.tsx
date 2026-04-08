import { isAxiosError } from 'axios';
import { useEffect, useState, type SubmitEvent } from 'react';

import type { User } from '../../../../../../types/user.types';
import UploadAvatarIcon from '../../../../components/icons/UploadAvatarIcon';
import AvatarContainer from '../../../../components/ui/AvatarContainer';
import ScrollArea from '../../../../components/ui/ScrollArea';
import { useUpdateUserProfile } from '../../../user/user.queries';
import { EditImageWrapper, Textarea, TextInput } from '../../components/ProfileSectionComponents';
import UnsavedChanges from '../../components/UnsavedChanges';

interface MainProfileContentProps {
  user: User;
  flashWarning: boolean;
  unsavedChanges: boolean;
  setUnsavedChanges: (value: boolean) => void;
}

interface UpdateUserProfileServerErrors {
  display_name?: string;
  pronouns?: string;
  bio?: string;
}

export default function MainProfileContent({
  user,
  flashWarning,
  unsavedChanges,
  setUnsavedChanges,
}: MainProfileContentProps) {
  const [displayName, setDisplayName] = useState(user.display_name ?? '');
  const [pronouns, setPronouns] = useState(user.pronouns ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [avatarFile, setAvatarFile] = useState<File | string>('');
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar_url ?? '/images/users/avatar/default'
  );
  const [bannerFile, setBannerFile] = useState<File | string>('');
  const [bannerPreview, setBannerPreview] = useState(user.banner_url ?? '');

  const updateUserProfile = useUpdateUserProfile();

  const serverErrors = isAxiosError(updateUserProfile.error)
    ? (updateUserProfile.error.response?.data?.errors as UpdateUserProfileServerErrors)
    : undefined;

  const hasChanges =
    displayName !== (user.display_name ?? '') ||
    pronouns !== (user.pronouns ?? '') ||
    bio !== (user.bio ?? '') ||
    avatarPreview !== (user.avatar_url ?? '') ||
    bannerPreview !== (user.banner_url ?? '');

  useEffect(() => {
    setUnsavedChanges(hasChanges);
  }, [hasChanges, setUnsavedChanges]);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const avatar_url = avatarFile ? avatarFile : avatarPreview;
    const banner_url = bannerFile ? bannerFile : bannerPreview;
    updateUserProfile.mutate(
      { display_name: displayName, pronouns, bio, avatar_url, banner_url },
      { onSuccess: handleReset }
    );
  }

  function handleReset() {
    setDisplayName(user.display_name ?? '');
    setPronouns(user.pronouns ?? '');
    setBio(user.bio ?? '');
    setAvatarFile('');
    setBannerFile('');
    setAvatarPreview(user.avatar_url ?? '/images/users/avatar/default');
    setBannerPreview(user.banner_url ?? '');
  }

  function handleLabelKeyDown(e: React.KeyboardEvent<HTMLLabelElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.querySelector('input')?.click();
    }
  }

  const previewDisplayName = displayName || user.display_name || user.username;
  const previewPronouns = pronouns || user.pronouns;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea scrollbarClassName="translate-x-6">
        <section className="relative grid flex-1 gap-12">
          <div className="flex flex-wrap gap-8">
            <form
              id="mainProfileForm"
              className="grid min-w-90 flex-1 gap-5"
              onSubmit={handleSubmit}
            >
              <TextInput
                title="Display Name"
                name="display_name"
                value={displayName}
                placeholder={user.username}
                maxLength={50}
                onChange={(e) => setDisplayName(e.target.value)}
                error={serverErrors?.display_name}
              />
              <hr className="text-dark-500" />
              <TextInput
                title="Pronouns"
                name="pronouns"
                value={pronouns}
                placeholder="Add your pronouns"
                maxLength={20}
                onChange={(e) => setPronouns(e.target.value)}
                error={serverErrors?.pronouns}
              />
              <hr className="text-dark-500" />
              <EditImageWrapper title="Avatar">
                <div className="flex items-center gap-2">
                  <label className="bg-info hover:bg-info-hover cursor-pointer rounded-lg px-3 py-2 font-semibold">
                    Change Avatar
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
                  <button
                    type="button"
                    className="bg-dark-500 border-dark-400 hover:bg-dark-400 cursor-pointer rounded-lg border px-3 py-2 font-semibold"
                    onClick={() => {
                      setAvatarFile('');
                      setAvatarPreview('/images/users/avatar/default.webp');
                    }}
                  >
                    Remove Avatar
                  </button>
                </div>
              </EditImageWrapper>
              <EditImageWrapper title="Banner">
                <div className="flex items-center gap-2">
                  <label className="bg-info hover:bg-info-hover cursor-pointer rounded-lg px-3 py-2 font-semibold">
                    Change Banner
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
                  <button
                    type="button"
                    className="bg-dark-500 border-dark-400 hover:bg-dark-400 cursor-pointer rounded-lg border px-3 py-2 font-semibold"
                    onClick={() => {
                      setBannerFile('');
                      setBannerPreview('');
                    }}
                  >
                    Remove Banner
                  </button>
                </div>
              </EditImageWrapper>
              <hr className="text-dark-500" />
              <Textarea
                title="Bio"
                name="bio"
                value={bio}
                maxLength={190}
                onChange={(e) => setBio(e.target.value)}
                error={serverErrors?.bio}
              />
            </form>

            <div className="sticky top-0 h-fit w-90 self-start">
              <div className="grid gap-3">
                <h4 className="text-lg font-semibold">Preview</h4>
                <div className="bg-dark-500 border-dark-400 grid overflow-hidden rounded-lg border">
                  <div className="relative grid h-30">
                    <label
                      className="group relative cursor-pointer bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundColor: user.avatar_color,
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

                    <label
                      tabIndex={0}
                      onKeyDown={handleLabelKeyDown}
                      title={typeof avatarFile !== 'string' ? avatarFile.name : avatarFile}
                      className="absolute inset-s-4 -inset-be-10 cursor-pointer"
                    >
                      <div className="group relative size-24 rounded-full">
                        <AvatarContainer
                          avatarUrl={avatarPreview || user.avatar_url}
                          avatarColor={user.avatar_color}
                          alt={`${user.username}'s avatar`}
                          className="border-dark-400 size-24 border-6"
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
                  </div>

                  <div className="grid gap-4 overflow-hidden px-4 pt-14 pb-4">
                    <div className="overflow-hidden">
                      <p className="line-clamp-2 overflow-hidden text-xl font-bold wrap-break-word whitespace-normal">
                        {previewDisplayName}
                      </p>
                      <div className="flex flex-wrap gap-x-2">
                        <p className="truncate">{user.username}</p>
                        {previewPronouns && <p className="truncate">• {previewPronouns}</p>}
                      </div>
                    </div>
                    {(bio || user.bio) && (
                      <pre className="line-clamp-3 overflow-hidden wrap-break-word whitespace-normal">
                        {bio || user.bio}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollArea>

      {unsavedChanges && (
        <UnsavedChanges
          form="mainProfileForm"
          handleReset={handleReset}
          flashWarning={flashWarning}
        />
      )}
    </div>
  );
}
