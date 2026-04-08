import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from '../../../../../../../../../features/friendship/friendship.queries';

export default function PendingIncomingSection({
  userId,
  senderName,
}: {
  userId: number;
  senderName: string;
}) {
  const accept = useAcceptFriendRequest();
  const decline = useDeclineFriendRequest();

  return (
    <section className="bg-dark-500 grid gap-2 rounded-lg px-3 py-2">
      <h5 className="break-all">
        <span className="font-semibold">{senderName}</span> sent you a friend request.
      </h5>
      <div className="flex items-center gap-2">
        <button
          className="bg-info hover:bg-info-hover cursor-pointer rounded-md px-2.5 py-1 font-medium"
          onClick={() => accept.mutate(userId)}
        >
          Accept
        </button>
        <button
          className="bg-dark-300 hover:bg-dark-400 cursor-pointer rounded-md px-2.5 py-1 font-medium"
          onClick={() => decline.mutate(userId)}
        >
          Decline
        </button>
      </div>
    </section>
  );
}
