// UserGroupsSelect.tsx
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Select } from 'radix-ui';

import type { Group } from '../../../../../types/group.types';
import AvatarContainer from '../../../components/ui/AvatarContainer';

interface UserGroupsSelectProps {
  groups: Group[];
  value: string;
  onValueChange: (value: string) => void;
}

export default function UserGroupsSelect({ groups, value, onValueChange }: UserGroupsSelectProps) {
  if (!groups.length) return <p className="text-light-700">You have no groups joined.</p>;

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="border-dark-500 bg-dark-900 inline-flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-2 outline-none">
        <span className="min-w-0 flex-1 truncate text-start">
          <Select.Value />
        </span>
        <Select.Icon className="shrink-0">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="bg-dark-600 border-dark-400 z-200 overflow-hidden rounded-lg border"
          style={{ width: 'var(--radix-select-trigger-width)' }}
        >
          <Select.ScrollUpButton className="bg-dark-600 flex h-6 cursor-default items-center justify-center">
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            {groups.map((group) => (
              <Select.Item
                key={group.group_id}
                value={String(group.group_id)}
                className="data-highlighted:bg-dark-500 relative flex w-full cursor-pointer items-center gap-2 rounded-md py-2 pr-8 pl-3 outline-none select-none"
              >
                <AvatarContainer
                  avatarUrl={group.group_avatar_url ?? ''}
                  avatarColor={group.group_avatar_color}
                  alt={`${group.group_name}'s avatar`}
                  className="size-6 shrink-0"
                />
                <Select.ItemText asChild>
                  <span className="block min-w-0 flex-1 truncate">{group.group_name}</span>
                </Select.ItemText>
                <Select.ItemIndicator className="absolute right-2 shrink-0">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="bg-dark-600 flex h-6 cursor-default items-center justify-center">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
