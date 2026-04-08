import type { ReactNode } from 'react';

interface TargetSectionProps {
  title: string;
  children: ReactNode;
}

export default function TargetSection({ title, children }: TargetSectionProps) {
  return (
    <section className="border-light-500 grid gap-4 not-last:mb-4 not-last:border-b not-last:pb-4">
      <h5 className="font-medium">{title}:</h5>
      {children}
    </section>
  );
}
