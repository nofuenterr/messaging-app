import { isAxiosError } from 'axios';
import { useEffect, useState, type Dispatch, type SetStateAction, type SubmitEvent } from 'react';

import type { Group } from '../../../../../../types/group.types';
import type { User } from '../../../../../../types/user.types';
import AvatarContainer from '../../../../components/ui/AvatarContainer';
import ScrollArea from '../../../../components/ui/ScrollArea';
import { useUpdateGroupProfile } from '../../../group/group.queries';
import { TextInput } from '../../components/ProfileSectionComponents';
import UnsavedChanges from '../../components/UnsavedChanges';
import UserGroupsSelect from '../../components/UserGroupsSelect';
import type { ProfileSectionProps } from '../../profile.types';

interface PerGroupProfilesContentProps extends ProfileSectionProps {
  user: User;
  groups: Group[];
  setFlashWarning: Dispatch<SetStateAction<boolean>>;
}

interface UpdateUserGroupProfileServerErrors {
  group_display_name?: string;
  group_pronouns?: string;
}

export default function PerGroupProfilesContent({
  user,
  groups,
  unsavedChanges,
  setUnsavedChanges,
  flashWarning,
  setFlashWarning,
}: PerGroupProfilesContentProps) {
  const [selectedGroupId, setSelectedGroupId] = useState(String(groups[0].group_id));
  const selectedGroup = groups.find((g) => String(g.group_id) === selectedGroupId) ?? groups[0];

  const [groupDisplayName, setGroupDisplayName] = useState(selectedGroup.group_display_name ?? '');
  const [groupPronouns, setGroupPronouns] = useState(selectedGroup.group_pronouns ?? '');

  const updateGroupProfile = useUpdateGroupProfile(selectedGroup.group_id);

  const serverErrors = isAxiosError(updateGroupProfile.error)
    ? (updateGroupProfile.error.response?.data?.errors as UpdateUserGroupProfileServerErrors)
    : undefined;

  // sync inputs when selected group changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroupDisplayName(selectedGroup.group_display_name ?? '');

    setGroupPronouns(selectedGroup.group_pronouns ?? '');
  }, [selectedGroupId, selectedGroup]);

  const hasChanges =
    groupDisplayName !== (selectedGroup.group_display_name ?? '') ||
    groupPronouns !== (selectedGroup.group_pronouns ?? '');

  useEffect(() => {
    setUnsavedChanges(hasChanges);
  }, [hasChanges, setUnsavedChanges]);

  function handleGroupChange(value: string) {
    if (unsavedChanges) {
      setFlashWarning(true);
      setTimeout(() => setFlashWarning(false), 1500);
      return;
    }

    setSelectedGroupId(value);
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    updateGroupProfile.mutate(
      { group_display_name: groupDisplayName, group_pronouns: groupPronouns },
      { onSuccess: handleReset }
    );
  }

  function handleReset() {
    setGroupDisplayName(selectedGroup.group_display_name ?? '');
    setGroupPronouns(selectedGroup.group_pronouns ?? '');
  }

  const previewDisplayName = groupDisplayName || user.display_name || user.username;
  const previewPronouns = groupPronouns || user.pronouns;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea scrollbarClassName="translate-x-6">
        <section className="relative grid flex-1 gap-5">
          <div className="grid gap-3">
            <h4 className="text-lg font-semibold">Choose a group</h4>
            <UserGroupsSelect
              groups={groups}
              value={selectedGroupId}
              onValueChange={handleGroupChange}
            />
          </div>

          <hr className="text-dark-500" />

          <div className="flex flex-wrap gap-8">
            <form
              id="perGroupProfileForm"
              className="grid min-w-90 flex-1 content-start gap-5"
              onSubmit={handleSubmit}
            >
              <TextInput
                title="Display Name"
                name="group_display_name"
                value={groupDisplayName}
                placeholder={user.display_name || user.username}
                maxLength={50}
                onChange={(e) => setGroupDisplayName(e.target.value)}
                error={serverErrors?.group_display_name}
              />
              <hr className="text-dark-500" />
              <TextInput
                title="Pronouns"
                name="group_pronouns"
                value={groupPronouns}
                placeholder="Add your pronouns"
                maxLength={20}
                onChange={(e) => setGroupPronouns(e.target.value)}
                error={serverErrors?.group_pronouns}
              />
              {/* avatar, banner, bio — reserved for future backend support */}
            </form>

            {/* preview */}
            <div className="sticky top-0 h-fit w-90 self-start">
              <div className="grid gap-3">
                <h4 className="text-lg font-semibold">Preview</h4>
                <div className="bg-dark-500 border-dark-400 grid overflow-hidden rounded-lg border">
                  <div
                    className="relative h-30 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundColor: user.avatar_color,
                      backgroundImage: `url(${user.banner_url})`,
                    }}
                  />

                  <div className="relative -mt-12 overflow-hidden px-4 pb-4">
                    <AvatarContainer
                      avatarUrl={user.avatar_url}
                      avatarColor={user.avatar_color}
                      alt={`${user.username}'s avatar`}
                      className="border-dark-400 size-24 border-4"
                    />
                    <div className="mt-2 overflow-hidden">
                      <p className="line-clamp-2 overflow-hidden text-xl font-bold wrap-break-word whitespace-normal">
                        {previewDisplayName}
                      </p>
                      <div className="flex flex-wrap gap-x-2">
                        <p className="truncate">{user.username}</p>
                        {previewPronouns && <p className="truncate">• {previewPronouns}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollArea>

      {unsavedChanges && (
        <UnsavedChanges
          form="perGroupProfileForm"
          handleReset={handleReset}
          flashWarning={flashWarning}
        />
      )}
    </div>
  );
}
