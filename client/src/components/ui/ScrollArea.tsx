import { ScrollArea } from 'radix-ui';
import type { ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface ScrollAreaRootProps {
  children: ReactNode;
  rootClassName?: string;
  viewportClassName?: string;
  scrollbarClassName?: string;
  viewportRef?: Ref<HTMLDivElement>;
}

export default function ScrollAreaRoot({
  children,
  rootClassName,
  viewportClassName,
  scrollbarClassName,
  viewportRef,
}: ScrollAreaRootProps) {
  return (
    <ScrollArea.Root className={twMerge('h-full min-h-0 flex-1 overflow-visible', rootClassName)}>
      <ScrollArea.Viewport
        ref={viewportRef}
        className={twMerge('h-full w-full flex-1', viewportClassName)}
      >
        {children}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar
        className={twMerge(
          'bg-dark-900 hover:bg-dark-500 flex w-2.5 touch-none p-0.5 transition-[background] duration-150 ease-out select-none',
          scrollbarClassName
        )}
        orientation="vertical"
      >
        <ScrollArea.Thumb className="bg-dark-300 relative flex-1 rounded-full before:absolute before:top-1/2 before:left-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner className="bg-dark-900" />
    </ScrollArea.Root>
  );
}
