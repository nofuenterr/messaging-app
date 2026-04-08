import type { ReactNode } from 'react';

export default function ArticleWrapper({ children }: { children: ReactNode }) {
  return (
    <article className="bg-dark-700 flex h-dvh min-h-0 flex-1 flex-col gap-6 px-6 py-8">
      {children}
    </article>
  );
}
