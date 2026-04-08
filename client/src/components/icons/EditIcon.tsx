import { twMerge } from 'tailwind-merge';

export default function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-5', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 6l-6 6v4h4l6-6m-4-4l3-3 4 4-3 3m-4-4l4 4m-8-6H4v16h16v-6"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
