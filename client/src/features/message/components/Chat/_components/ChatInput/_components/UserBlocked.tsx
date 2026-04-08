import { useParams } from 'react-router-dom';

import { useShowUserProfileStore } from '../../../../../../../stores/useShowUserProfile';
import { useUnblockUser } from '../../../../../../block/block.queries';

export default function UserBlocked() {
  const params = useParams();
  const id = params.id ? Number(params.id) : undefined;
  const unblockUser = useUnblockUser();
  const { setShowUserProfile } = useShowUserProfileStore();

  return (
    <div className="bg-dark-900 border-dark-600 mt-5 flex items-center justify-between gap-2 rounded-full border px-5 outline-none">
      <p className="py-3 font-semibold text-balance">
        You cannot send messages to a user you have blocked.
      </p>
      <button
        className="border-dark-400 bg-dark-500 hover:bg-dark-400 cursor-pointer rounded-full border px-2 py-1 text-sm font-medium"
        onClick={() => {
          unblockUser.mutate(id!);
          setShowUserProfile(true);
        }}
      >
        Unblock
      </button>
    </div>
  );
}
