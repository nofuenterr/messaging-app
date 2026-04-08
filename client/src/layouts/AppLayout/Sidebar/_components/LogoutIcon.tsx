import { twMerge } from 'tailwind-merge';

export default function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-8', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#fff">
        <path d="M8.002 7c.012-2.175.109-3.353.877-4.121C9.758 2 11.172 2 14 2h1c2.829 0 4.243 0 5.122.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.878 5.121C19.242 22 17.829 22 15 22h-1c-2.828 0-4.242 0-5.121-.879-.768-.768-.865-1.946-.877-4.121M8 19.5c-2.357 0-3.536 0-4.268-.732C3 18.035 3 16.857 3 14.5v-5c0-2.357 0-3.536.732-4.268C4.464 4.5 5.643 4.5 8 4.5M15 12H6m0 0l2 2m-2-2l2-2" />
      </g>
    </svg>
  );
}
