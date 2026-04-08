import { twMerge } from 'tailwind-merge';

export default function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-6', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.293 21.292l-.01.01a1 1 0 00.975 1.664l5.795-1.545c1.08.375 2.241.579 3.447.579C18.299 22 23 17.299 23 11.5S18.299 1 12.5 1 2 5.701 2 11.5c0 2.103.62 4.064 1.685 5.707-.03.318-.083.683-.166 1.097-.23 1.148-.568 1.925-.83 2.398a4.09 4.09 0 01-.32.495c-.036.048-.062.08-.076.095z"
        className="fill-light-900 group-hover:fill-info-hover"
      />
    </svg>
  );
}
