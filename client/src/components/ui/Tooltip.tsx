import { Tooltip } from 'radix-ui';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TooltipComponentProps {
  children: ReactNode;
  content: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function TooltipComponent({
  children,
  content,
  className,
  open,
  onOpenChange,
}: TooltipComponentProps) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root open={open} onOpenChange={onOpenChange}>
        <Tooltip.Trigger asChild>
          <span className="inline-flex">{children}</span>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className={twMerge(
              'bg-dark-500 border-dark-400 z-200 rounded-lg border-2 px-3.75 py-2.5 leading-none font-semibold select-none',
              className
            )}
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-dark-400" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
