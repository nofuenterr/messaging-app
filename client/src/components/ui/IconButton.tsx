import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function IconButton({
  onClick,
  children,
  className,
  disabled,
  ariaLabel,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        'text-md grid flex-1 cursor-pointer place-items-center gap-1 rounded-xl bg-[#324140] p-2 font-medium',
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
