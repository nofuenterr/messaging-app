import { twMerge } from 'tailwind-merge';

export default function RemoveFriendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge('size-5', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="fill-light-900 group-hover:fill-warning-hover">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17 6.5c0 3.038-2.239 5.5-5 5.5S7 9.538 7 6.5 9.239 1 12 1s5 2.462 5 5.5zm-8 0c0 1.823 1.343 3.3 3 3.3s3-1.477 3-3.3c0-1.823-1.343-3.3-3-3.3S9 4.677 9 6.5z"
        />
        <path d="M11.676 14.995c-.89-.027-1.482-.167-1.95-.35-.462-.181-.828-.408-1.31-.707-.093-.059-.192-.12-.296-.184a2.628 2.628 0 00-3.256.388c-.38.384-.824.88-1.18 1.42C3.347 16.079 3 16.765 3 17.5V20a3 3 0 003 3h7.101a7.018 7.018 0 01-1.427-2H6a1 1 0 01-1-1v-2.5c0-.145.085-.427.356-.839.254-.386.598-.777.93-1.112a.629.629 0 01.788-.09c.083.05.167.103.253.157.482.301 1.022.638 1.671.892.59.23 1.254.39 2.078.457a6.948 6.948 0 01.6-1.97zM16 17a1 1 0 100 2h4a1 1 0 100-2h-4z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 24a6 6 0 100-12 6 6 0 000 12zm0-1.982a4.018 4.018 0 110-8.036 4.018 4.018 0 010 8.036z"
        />
      </g>
    </svg>
  );
}
