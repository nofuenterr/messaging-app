import { twMerge } from 'tailwind-merge';

export default function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('fill-danger stroke-danger size-5', className)}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
    >
      <path d="M11 4.5h10a1.5 1.5 0 000-3H11a1.5 1.5 0 000 3zM5 9.5V26a5 5 0 005 5h12a5 5 0 005-5V9.5h1.645C29.393 9.5 30 8.828 30 8s-.607-1.5-1.355-1.5H3.355C2.607 6.5 2 7.172 2 8s.607 1.5 1.355 1.5H5zm7 3.5v12a1 1 0 002 0V13a1 1 0 00-2 0zm6 0v12a1 1 0 002 0V13a1 1 0 00-2 0z" />
    </svg>
  );
}
