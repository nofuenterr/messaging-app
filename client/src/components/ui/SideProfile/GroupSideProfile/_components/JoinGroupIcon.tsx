import { twMerge } from 'tailwind-merge';

export default function JoinGroupIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-5', className)}
      viewBox="0 0 24 24"
      data-name="24x24/On Light/Session-Join"
      xmlns="http://www.w3.org/2000/svg"
      fill="#fff"
    >
      <path fill="none" d="M0 0H24V24H0z" />
      <path
        d="M5.75 17.5a.75.75 0 010-1.5h8.8A1.363 1.363 0 0016 14.75v-12a1.363 1.363 0 00-1.45-1.25h-8.8a.75.75 0 010-1.5h8.8a2.853 2.853 0 012.95 2.75v12a2.853 2.853 0 01-2.95 2.75zm1.47-4.22a.75.75 0 010-1.061L9.939 9.5H.75a.75.75 0 010-1.5h9.19L7.22 5.28a.75.75 0 011.06-1.06l4 4 .013.013.005.006.007.008.007.008v.005l.008.009.008.01.008.011.008.011.008.011.007.011v.005l.006.01v.03l.006.011.008.015a.751.751 0 01-.157.878L8.28 13.28a.75.75 0 01-1.06 0z"
        transform="translate(3.25 3.25)"
        fill="#fff"
      />
    </svg>
  );
}
