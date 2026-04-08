import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
  withSurface?: boolean;
}

export function Section({ children, title, className = '', withSurface = false }: SectionProps) {
  return (
    <section 
      className={`flex flex-col gap-4 ${withSurface ? 'bg-coup-surface p-4 rounded-xl border-2 border-coup-border' : ''} ${className}`}
    >
      {title && (
        <h2 className="text-xl font-serif text-coup-text-secondary text-center mb-2">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
