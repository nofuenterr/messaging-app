import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function IconButtonRounded({ onClick, children, className }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'group bg-dark-700 grid cursor-pointer place-items-center rounded-full p-2',
        className
      )}
    >
      {children}
    </button>
  );
}
