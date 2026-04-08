import type { ReactNode } from 'react';

import AvatarContainer from './AvatarContainer';

interface NameplateProps {
  avatar_color: string;
  avatar_url: string;
  name: string;
  subname?: string;
  date?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export default function Nameplate({
  avatar_color,
  avatar_url,
  name,
  subname,
  date,
  onClick,
  children,
}: NameplateProps) {
  return (
    <div
      className="hover:bg-dark-500 flex w-full cursor-pointer items-center gap-4 rounded-lg px-4 py-3"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick()}
    >
      <AvatarContainer
        avatarUrl={avatar_url}
        avatarColor={avatar_color}
        alt={`${name}'s avatar`}
        className="size-10"
      />
      <div className="mr-auto min-w-0 text-start">
        <p className="text-lg font-semibold break-all">{name}</p>
        {subname ? <p className="text-light-800 font-medium break-all">{subname}</p> : null}
      </div>
      {date ? <p className="text-end text-nowrap">{date}</p> : null}
      {children}
    </div>
  );
}
