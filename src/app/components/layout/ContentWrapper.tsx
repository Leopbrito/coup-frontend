import { ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ContentWrapper({ children, className = '' }: ContentWrapperProps) {
  return (
    <div className={`w-full max-w-lg mx-auto flex-1 flex flex-col relative ${className}`}>
      {children}
    </div>
  );
}
