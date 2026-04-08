import { twMerge } from 'tailwind-merge';

export default function BlocklistIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-8', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {'{&apos; &apos;}'}
      <circle cx={12} cy={6} r={4} stroke="#fff" />
      {'{&apos; &apos;}'}
      <path
        d="M15 13.327A13.57 13.57 0 0012 13c-4.418 0-8 2.015-8 4.5S4 22 12 22c5.687 0 7.331-1.018 7.807-2.5"
        stroke="#fff"
      />
      {'{&apos; &apos;}'}
      <path
        d="M15.171 18.828a4 4 0 105.657-5.657m-5.656 5.657a4 4 0 015.657-5.657m-5.658 5.657l5.657-5.656"
        stroke="#fff"
      />
      {'{&apos; &apos;}'}
    </svg>
  );
}
