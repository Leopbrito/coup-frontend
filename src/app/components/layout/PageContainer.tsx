import { ReactNode } from 'react';
import { IS_TEST_MODE } from '../../../config/env';
import { Link } from 'react-router';
import { DevToolsPanel } from '../devtools/DevToolsPanel';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  withBackgroundDecoration?: boolean;
}

export function PageContainer({ children, className = '', withBackgroundDecoration = false }: PageContainerProps) {
  return (
    <div
      className={`min-h-dvh flex flex-col relative overflow-hidden bg-coup-bg text-coup-text-primary p-4 sm:p-6 md:p-8 ${className}`}
    >
      {IS_TEST_MODE && (
        <Link 
          to="/sandbox"
          className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-coup-accent-danger/20 border border-coup-accent-danger/50 text-coup-accent-danger text-xs font-bold font-sans tracking-widest uppercase hover:bg-coup-accent-danger/30 transition-colors backdrop-blur-md shadow-lg"
        >
          Test Mode On
        </Link>
      )}

      {withBackgroundDecoration && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl bg-coup-primary" />
        </div>
      )}
      {children}
      {IS_TEST_MODE && <DevToolsPanel />}
    </div>
  );
}
