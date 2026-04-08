import type { ReactNode } from 'react';

export default function FeatureLayoutWrapper({ children }: { children: ReactNode }) {
  return <div className="grid flex-1 grid-cols-[auto_1fr]">{children}</div>;
}
