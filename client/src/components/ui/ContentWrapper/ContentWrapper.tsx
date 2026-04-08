import type { ReactNode } from 'react';

export default function ContentWrapper({ children }: { children: ReactNode }) {
  return <div className="grid h-dvh min-h-0 flex-1 grid-cols-[1fr_auto]">{children}</div>;
}
