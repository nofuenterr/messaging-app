import { twMerge } from 'tailwind-merge';

export default function MyGroupsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-8', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {'{&apos; &apos;}'}
      <path
        d="M20.5 21a2.5 2.5 0 002.5-2.5c0-2.327-1.952-3.301-4-3.708M15 11a4 4 0 000-8M3.5 21h11a2.5 2.5 0 002.5-2.5c0-4.08-6-4-8-4s-8-.08-8 4A2.5 2.5 0 003.5 21zM13 7a4 4 0 11-8 0 4 4 0 018 0z"
        stroke="#fff"
      />
      {'{&apos; &apos;}'}
    </svg>
  );
}
