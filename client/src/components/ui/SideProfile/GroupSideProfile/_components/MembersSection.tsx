import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { GroupDetail } from '../../../../../../../types/group.types';
import ChevronDownIcon from '../../../../icons/ChevronDown';
import AvatarContainer from '../../../AvatarContainer';

interface MembersSectionProps {
  members: GroupDetail['members'];
  memberLabel: string;
}

export default function MembersSection({ members, memberLabel }: MembersSectionProps) {
  const [active, setActive] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <section className="bg-dark-500 grid shrink-0 overflow-hidden rounded-lg">
      <div
        onClick={() => setActive(!active)}
        className="hover:bg-dark-400 flex cursor-pointer items-center justify-between px-3 py-2"
      >
        <h5 className="font-semibold">{memberLabel}</h5>
        <ChevronDownIcon active={active} />
      </div>

      {members.length > 0 && active && (
        <ul className="overflow-hidden">
          {members.map((member) => {
            return (
              <li
                key={member.id}
                onClick={() => navigate(`/users/${member.id}/messages`)}
                className="hover:bg-dark-400 cursor-pointer"
              >
                <div className="flex items-center gap-3 px-3 py-1">
                  <AvatarContainer
                    avatarUrl={member.avatar_url}
                    avatarColor={member.avatar_color}
                    alt={`${member.group_display_name}'s avatar`}
                    className="size-8"
                  />
                  <p className="truncate font-medium">{member.group_display_name}</p>
                  <p className="bg-info ml-auto rounded-full px-2 py-1 text-sm font-medium">
                    {member.membership_role}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
