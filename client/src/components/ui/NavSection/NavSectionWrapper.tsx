import type { ReactNode } from 'react';

import ScrollArea from '../ScrollArea';

interface NavSectionWrapperProps {
  title: string;
  children: ReactNode;
}

export default function NavSectionWrapper({ title, children }: NavSectionWrapperProps) {
  return (
    <section className="bg-dark-900 flex h-dvh min-h-0 w-90 flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <ScrollArea scrollbarClassName="translate-x-6">
        <nav className="overflow-y-auto">
          <ul className="grid gap-3">{children}</ul>
        </nav>
      </ScrollArea>
    </section>
  );
}
