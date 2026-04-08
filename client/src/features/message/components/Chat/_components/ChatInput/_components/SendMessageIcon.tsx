import { twMerge } from 'tailwind-merge';

export default function SendMessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-5', className)}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.945 1.903v.014L15.489 19.91a1.489 1.489 0 01-1.442 1.085 1.486 1.486 0 01-1.352-.858L9.347 13.07a.375.375 0 01.074-.425l5.368-5.37a.75.75 0 00-1.06-1.06l-5.377 5.368a.375.375 0 01-.425.075L.895 8.327a1.535 1.535 0 01-.894-1.454 1.49 1.49 0 011.085-1.36L19.08.055h.014a1.5 1.5 0 011.85 1.847z"
        className="group-disabled:fill-success-soft fill-success group-hover:fill-success-hover"
      />
    </svg>
  );
}
