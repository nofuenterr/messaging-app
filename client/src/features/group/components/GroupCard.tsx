import { format } from 'date-fns';

import type { Group } from '../../../../../types/group.types';
import AvatarContainer from '../../../components/ui/AvatarContainer';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

export default function GroupCard({ group, onClick }: GroupCardProps) {
  const joinedGroupAt = group.joined ? format(group.joined, 'MMM d, y') : null;
  const memberLabel =
    Number(group.member_count) === 1 ? '1 Member' : `${group.member_count} Members`;

  return (
    <li className="w-full">
      <button
        onClick={onClick}
        className="bg-dark-500 border-dark-400 grid h-80 w-full cursor-pointer grid-rows-[0.8fr_1fr] overflow-hidden rounded-lg border text-start"
      >
        <div
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundColor: group.group_avatar_color,
            backgroundImage: `url(${group.group_banner_url})`,
          }}
        >
          <AvatarContainer
            avatarUrl={group.group_avatar_url}
            avatarColor={group.group_avatar_color}
            alt={`${group.group_name}'s avatar`}
            className="border-dark-400 absolute inset-s-4 -inset-be-8 size-16 rounded-md border-4"
          />
        </div>

        <div className="flex min-h-0 flex-col px-4 pt-9 pb-4 text-sm">
          <div className="grid min-h-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-success size-4 shrink-0 rounded-full"></div>
              <h4 className="truncate text-base font-semibold">{group.group_name}</h4>
            </div>

            <p className="line-clamp-3 overflow-hidden wrap-break-word whitespace-normal">
              {group.group_description}
            </p>

            {joinedGroupAt && (
              <div className="flex items-center gap-1.5">
                <p className="">Joined: {joinedGroupAt}</p>
                <span>•</span>
                <p className="bg-info rounded-full px-1.5 py-0.5 text-xs uppercase">
                  {group.membership_role}
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center gap-1">
            <div className="bg-gray size-3 shrink-0 rounded-full" />
            <p>{memberLabel}</p>
          </div>
        </div>
      </button>
    </li>
  );
}
