import { twMerge } from 'tailwind-merge';

export default function LeaveGroupIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-5', className)}
      viewBox="0 0 24 24"
      data-name="24x24/On Light/Session-Leave"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000"
    >
      <path fill="none" d="M0 0H24V24H0z" />
      <path
        d="M2.95 17.5A2.853 2.853 0 010 14.75v-12A2.854 2.854 0 012.95 0h8.8a.75.75 0 010 1.5h-8.8A1.362 1.362 0 001.5 2.75v12A1.363 1.363 0 002.95 16h8.8a.75.75 0 010 1.5zm9.269-4.219a.751.751 0 010-1.061l2.72-2.72H5.75a.75.75 0 010-1.5h9.19l-2.721-2.72a.75.75 0 111.061-1.06l4 4a.749.749 0 010 1.06l-4 4a.751.751 0 01-1.061 0z"
        transform="translate(3.25 3.25)"
        fill="#fff"
      />
    </svg>
  );
}
