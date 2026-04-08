import AvatarContainer from '../../../../../../AvatarContainer';
import SideProfileWrapper from '../../../../../_components/SideProfileWrapper';

import BlockIcon from './_components/BlockIcon';

interface HideUserProfileProps {
  avatarUrl: string;
  avatarColor: string;
  displayName: string;
  setShowUserProfile: (show: boolean) => void;
}

export default function HideUserProfile({
  avatarUrl,
  avatarColor,
  displayName,
  setShowUserProfile,
}: HideUserProfileProps) {
  return (
    <SideProfileWrapper>
      <div className="absolute top-0 flex w-80 flex-1 scale-75 flex-col">
        <div className="bg-dark-500 relative grid h-30 content-start justify-end p-4">
          <div className="border-dark-600 bg-dark-500 absolute inset-s-4 -inset-be-12 size-24 rounded-full border-4"></div>
        </div>

        <div className="*:bg-dark-500 mx-4 mt-18 grid auto-rows-[2.5rem] gap-4 *:rounded-lg">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="z-10 grid flex-1 place-content-center place-items-center overflow-hidden p-8 text-center backdrop-blur-xs">
        <div className="relative rounded-full">
          <AvatarContainer
            avatarUrl={avatarUrl}
            avatarColor={avatarColor}
            alt={`${displayName}'s avatar`}
            className="border-dark-600 size-20 rounded-full border-4"
          />
          <div className="bg-dark-400 absolute right-0 bottom-0 grid size-9 place-content-center rounded-full opacity-80">
            <BlockIcon />
          </div>
        </div>
        <h4 className="text-2xl font-bold">Show Profile?</h4>
        <p className="mt-3 break-all">
          You blocked <span className="font-medium">{displayName}</span>, so just making sure. They
          won&apos;t be notified, and will still be blocked
        </p>
        <button
          onClick={() => setShowUserProfile(true)}
          className="bg-info hover:bg-info-hover mt-4 cursor-pointer rounded-lg px-4 py-2 font-semibold"
        >
          Yes, show profile
        </button>
      </div>
    </SideProfileWrapper>
  );
}
