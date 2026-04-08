import type { ReactNode } from 'react';

export default function SideProfileWrapper({ children }: { children: ReactNode }) {
  return (
    <aside className="bg-dark-600 relative flex h-dvh min-h-0 w-80 flex-1 flex-col overflow-hidden">
      {children}
    </aside>
  );
}
