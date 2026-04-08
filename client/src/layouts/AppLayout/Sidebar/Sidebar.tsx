import { useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import type { User } from '../../../../../types/user.types';
import GroupIcon from '../../../components/icons/GroupIcon';
import AvatarContainer from '../../../components/ui/AvatarContainer';
import ScrollArea from '../../../components/ui/ScrollArea';
import { useLogout } from '../../../features/auth/auth.queries';
import ProfileIcon from '../../../features/profile/components/MyProfileNav/_components/ProfileIcon';

import AdminIcon from './_components/AdminIcon';
import LogoutDialog from './_components/LogoutDialog';
import LogoutIcon from './_components/LogoutIcon';
import MessageIconHollow from './_components/MessageIconHollow';
import NewGroupDialog from './_components/NewGroupDialog';
import NewGroupIcon from './_components/NewGroupIcon';

interface SidebarProps {
  user: User;
}
export default function Sidebar({ user }: SidebarProps) {
  const [newGroupActive, setNewGroupActive] = useState<boolean>(false);
  const logout = useLogout();

  return (
    <aside className="border-dark-700 order-1 flex h-dvh w-70 flex-col border-r">
      <div className="shrink-0 gap-2 text-center">
        <div
          className="relative h-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundColor: user.avatar_color, backgroundImage: `url(${user.banner_url})` }}
        >
          <AvatarContainer
            avatarUrl={user.avatar_url}
            avatarColor={user.avatar_color}
            alt={`${user.username}'s avatar`}
            className="border-dark-600 absolute inset-x-[calc((1/2*100%)-2.5rem)] -inset-be-10 size-20 border-4"
          />
        </div>
        <div className="mt-12 p-2">
          <p className="line-clamp-2 overflow-hidden font-semibold wrap-break-word whitespace-normal">
            {user.display_name ?? user.username}
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-1 text-sm break-all">
            <span className="line-clamp-2 overflow-hidden wrap-break-word whitespace-normal">
              {user.username}
            </span>
            <span className="truncate">{user.pronouns ? ` • ${user.pronouns}` : null}</span>
          </p>
        </div>
      </div>

      <ScrollArea>
        <nav className="flex flex-col gap-2 px-6 py-4 *:list-none">
          <SidebarLinkItem text="My Profile" link="/users/me" icon={<ProfileIcon />} />
          <NewGroupDialog newGroupActive={newGroupActive} onClose={() => setNewGroupActive(false)}>
            <NewGroupItem
              text="New Group"
              icon={<NewGroupIcon />}
              onClick={() => setNewGroupActive(true)}
            />
          </NewGroupDialog>
          <SidebarLinkItem text="Messages" link="/" type="messages" icon={<MessageIconHollow />} />
          <SidebarLinkItem
            text="Groups"
            link="/groups"
            type="groups"
            icon={<GroupIcon className="size-8" />}
          />
          {user.user_role === 'admin' && (
            <SidebarLinkItem text="Admin" link="/admin/users" type="admin" icon={<AdminIcon />} />
          )}
        </nav>
      </ScrollArea>

      <div className="shrink-0 px-6 pb-4">
        <LogoutButton
          text={logout.isPending ? 'Logging out...' : 'Logout'}
          onLogout={() => logout.mutate()}
          disabled={logout.isPending}
          icon={<LogoutIcon />}
        />
      </div>
    </aside>
  );
}

type SidebarLinkType = 'messages' | 'groups' | 'admin' | undefined;

interface SidebarLinkItemProps {
  text: string;
  link: string;
  icon: ReactNode;
  type?: SidebarLinkType;
}

function SidebarLinkItem({ text, link, icon, type }: SidebarLinkItemProps) {
  const location = useLocation();

  const isActive = (() => {
    if (type === 'messages')
      return location.pathname === '/' || location.pathname.includes('/messages');
    if (type === 'groups')
      return location.pathname.startsWith('/groups') && !location.pathname.includes('/messages');
    if (type === 'admin') return location.pathname.startsWith('/admin');
    return location.pathname.startsWith(link);
  })();

  return (
    <li>
      <NavLink
        to={link}
        className={`hover:bg-primary-hover flex items-center gap-4 rounded-full px-4 py-3 ${
          isActive ? 'bg-primary-soft' : ''
        }`}
      >
        <div className="grid place-content-center">{icon}</div>
        <p className="font-medium">{text}</p>
      </NavLink>
    </li>
  );
}

interface NewGroupItemProps {
  text: string;
  icon: ReactNode;
  onClick: () => void;
}

function NewGroupItem({ text, icon, onClick }: NewGroupItemProps) {
  return (
    <li onClick={onClick}>
      <button className="hover:bg-primary-hover flex w-full cursor-pointer items-center gap-4 rounded-full px-4 py-3">
        <div className="grid place-content-center">{icon}</div>
        <p className="font-medium">{text}</p>
      </button>
    </li>
  );
}

interface LogoutButtonProps {
  text: string;
  icon: ReactNode;
  onLogout: () => void;
  disabled: boolean;
}

function LogoutButton({ text, icon, onLogout, disabled }: LogoutButtonProps) {
  return (
    <LogoutDialog onLogout={onLogout} disabled={disabled}>
      <button className="hover:bg-primary-hover mt-auto mb-4 flex w-full cursor-pointer items-center gap-4 rounded-full px-4 py-3">
        <div className="grid place-content-center">{icon}</div>
        <p className="font-medium">{text}</p>
      </button>
    </LogoutDialog>
  );
}
