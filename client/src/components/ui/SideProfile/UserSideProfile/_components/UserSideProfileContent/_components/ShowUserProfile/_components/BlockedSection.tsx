import { useUnblockUser } from '../../../../../../../../../features/block/block.queries';

export default function BlockedSection({ userId }: { userId: number }) {
  const unblock = useUnblockUser();

  return (
    <section className="bg-dark-500 grid gap-2 rounded-lg px-3 py-2">
      <h5 className="font-semibold">You blocked them</h5>
      <button
        className="bg-info hover:bg-info-hover cursor-pointer justify-self-start rounded-md px-2 py-1 text-sm font-medium"
        onClick={() => unblock.mutate(userId)}
      >
        Unblock
      </button>
    </section>
  );
}
