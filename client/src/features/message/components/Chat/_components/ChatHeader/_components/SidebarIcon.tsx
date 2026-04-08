import { twMerge } from 'tailwind-merge';

export default function SidebarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-6', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#fff" strokeWidth={1.5}>
        <path d="M2 11c0-3.771 0-5.657 1.172-6.828C4.343 3 6.229 3 10 3h4c3.771 0 5.657 0 6.828 1.172C22 5.343 22 7.229 22 11v2c0 3.771 0 5.657-1.172 6.828C19.657 21 17.771 21 14 21h-4c-3.771 0-5.657 0-6.828-1.172C2 18.657 2 16.771 2 13v-2z" />
        <path d="M15 21V3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
