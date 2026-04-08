import type { UseMutationResult } from '@tanstack/react-query';

interface ReportActionButtonProps {
  text: string;
  mutation: UseMutationResult<void, Error, void>;
}

export default function ReportActionButton({ text, mutation }: ReportActionButtonProps) {
  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 text-xl font-medium uppercase disabled:opacity-50"
    >
      {text}
    </button>
  );
}
