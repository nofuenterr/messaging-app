import { twMerge } from 'tailwind-merge';

export default function MessageIconHollow({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-8', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 16.55v3.35a2.1 2.1 0 003.54 1.53l2.61-2.46h.87c5.52 0 10-3.8 10-8.5s-4.48-8.5-10-8.5-10 3.81-10 8.5a7.93 7.93 0 003 6.06l-.02.02z"
        stroke="#fff"
      />
    </svg>
  );
}
