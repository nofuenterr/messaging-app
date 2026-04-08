import { twMerge } from 'tailwind-merge';

export default function AllGroupsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-8', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {'{&apos; &apos;}'}
      <path
        d="M19 14c2.21 0 4 2 4 3.5a1.5 1.5 0 01-1.5 1.5H21m-4-8a3 3 0 100-6M5 14c-2.21 0-4 2-4 3.5A1.5 1.5 0 002.5 19H3m4-8a3 3 0 010-6m9.5 14h-9A1.5 1.5 0 016 17.5C6 15 9 14 12 14s6 1 6 3.5a1.5 1.5 0 01-1.5 1.5zM15 8a3 3 0 11-6 0 3 3 0 016 0z"
        stroke="#fff"
      />
      {'{&apos; &apos;}'}
    </svg>
  );
}
