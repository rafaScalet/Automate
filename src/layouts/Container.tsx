import { Outlet } from 'react-router';
import { NavBar } from '@/components/navbar';

export function Container() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-white text-black dark:bg-zinc-800 dark:text-white">
      <NavBar />
      <main className="m-5 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
