import { twMerge } from 'tailwind-merge';

export default function MoreIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-5', className)}
      viewBox="0 0 24 24"
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 12a2 2 0 11-2-2 2 2 0 012 2zm10-2a2 2 0 102 2 2 2 0 00-2-2zm-6 0a2 2 0 102 2 2 2 0 00-2-2z" />
    </svg>
  );
}
