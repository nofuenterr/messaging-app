import { twMerge } from 'tailwind-merge';

export default function UploadAvatarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('fill-light-700 h-7', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
    >
      <path d="M60 10H49.656l-6.828-6.828A3.998 3.998 0 0040 2H24a3.998 3.998 0 00-2.828 1.172L14.344 10H4c-2.211 0-4 1.789-4 4v44c0 2.211 1.789 4 4 4h56c2.211 0 4-1.789 4-4V14c0-2.211-1.789-4-4-4zM32 50c-8.836 0-16-7.164-16-16s7.164-16 16-16 16 7.164 16 16-7.164 16-16 16z" />
      <circle cx={32} cy={34} r={8} />
    </svg>
  );
}
