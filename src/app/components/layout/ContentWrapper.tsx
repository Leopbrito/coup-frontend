import { ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ContentWrapper({ children, className = '' }: ContentWrapperProps) {
  return (
    <div className={`w-full max-w-lg mx-auto flex-1 flex flex-col min-h-0 relative ${className}`}>
      {children}
    </div>
  );
}
