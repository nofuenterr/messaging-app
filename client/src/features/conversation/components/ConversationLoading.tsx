import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';
import SideProfileLoading from '../../../components/ui/SideProfile/_components/SideProfileLoading';

export default function ConversationLoading() {
  return (
    <ContentWrapper>
      <div className="bg-dark-700 flex h-dvh flex-col">
        <div className="bg-dark-600 grid h-17 content-center px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="mr-auto flex items-center gap-3">
              <div className="bg-dark-500 size-10 rounded-full"></div>
              <div className="bg-dark-500 h-6 w-30 rounded-full"></div>
            </div>
            <div className="bg-dark-500 size-8 rounded-full"></div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto"></div>

        <div className="flex items-center gap-4 p-5">
          <div className="bg-dark-900 border-dark-600 h-12 flex-1 rounded-full border px-5 py-3 outline-none"></div>
          <div className="bg-dark-900 size-10 rounded-full"></div>
        </div>
      </div>

      <SideProfileLoading />
    </ContentWrapper>
  );
}
