import { useParams } from 'react-router-dom';

import { useJoinGroup } from '../../../../../../group/group.queries';

export default function GroupNotJoined() {
  const params = useParams();
  const id = params.id ? Number(params.id) : undefined;
  const joinGroup = useJoinGroup();

  return (
    <div className="bg-dark-900 border-dark-600 mt-5 flex items-center justify-between gap-2 rounded-full border px-5 outline-none">
      <p className="py-3 font-semibold text-balance">
        You do not have permission to send messages in this group.
      </p>
      <button
        className="border-dark-400 bg-dark-500 hover:bg-dark-400 cursor-pointer rounded-full border px-2 py-1 text-sm font-medium"
        onClick={() => joinGroup.mutate(id!)}
      >
        Join Group
      </button>
    </div>
  );
}
