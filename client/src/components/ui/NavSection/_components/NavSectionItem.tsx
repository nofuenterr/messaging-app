import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavSectionItemProps {
  link: string;
  text: string;
  icon: ReactNode;
}

export default function NavSectionItem({ link, text, icon }: NavSectionItemProps) {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <li>
      <NavLink
        to={link}
        className={`hover:bg-dark-400 flex items-center gap-3 rounded-full px-4 py-3 ${
          isActive ? 'bg-dark-600' : ''
        }`}
      >
        <div className="*:size-7">{icon}</div>
        <h2 className="font-medium">{text}</h2>
      </NavLink>
    </li>
  );
}
