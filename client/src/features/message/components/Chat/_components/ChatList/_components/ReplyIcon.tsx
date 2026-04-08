import { twMerge } from 'tailwind-merge';

export default function ReplyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-6', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.4 3.804C7.553 2.267 10 3.082 10 5.003v3.006c4.677-.148 7.777 1.498 9.78 3.757 2.081 2.348 2.883 5.252 3.198 7.137.138.825-.397 1.42-.963 1.625a1.56 1.56 0 01-1.74-.475C18.695 18.126 15.5 15.488 10 15.488v3.509c0 1.921-2.447 2.736-3.6 1.2l-4.8-6.398a2.998 2.998 0 010-3.598l4.8-6.397zM8 5.003L3.2 11.4a1 1 0 000 1.2L8 18.997V14.5a1 1 0 011-1h1c7 0 10.6 3.962 10.6 3.962-.417-1.426-1.125-3.025-2.317-4.37C16.718 11.327 14.5 10 10 10H9a1 1 0 01-1-1V5.003z"
        fill="#fff"
      />
    </svg>
  );
}
