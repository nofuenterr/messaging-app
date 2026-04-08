import { twMerge } from 'tailwind-merge';

export default function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-5', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.705 4.954a1 1 0 00-1.414 0L8.727 17.518a1 1 0 01-1.414 0l-4.599-4.599A1 1 0 101.3 14.333l4.604 4.596a3 3 0 004.24-.002l12.56-12.559a1 1 0 000-1.414z"
        className="fill-light-900 group-hover:fill-success-hover"
      />
    </svg>
  );
}
