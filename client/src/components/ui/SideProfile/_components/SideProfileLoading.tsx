import SideProfileWrapper from './SideProfileWrapper';

export default function SideProfileLoading() {
  return (
    <SideProfileWrapper>
      <div className="bg-dark-500 relative grid h-30 content-start justify-end p-4">
        <div className="border-dark-600 bg-dark-500 absolute inset-s-4 -inset-be-12 size-24 rounded-full border-4"></div>
      </div>

      <div className="*:bg-dark-500 mx-4 mt-18 grid auto-rows-[2.5rem] gap-4 *:rounded-lg">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </SideProfileWrapper>
  );
}
