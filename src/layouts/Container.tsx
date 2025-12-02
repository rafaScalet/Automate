import type { PropsWithChildren } from 'react';

interface ContainerProps extends PropsWithChildren {}

export function Container({ children }: ContainerProps) {
  return (
    <div className="flex min-h-screen max-w-screen items-center justify-center bg-white font-inter text-black dark:bg-zinc-900 dark:text-white">
      {children}
    </div>
  );
}
