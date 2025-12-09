import { Outlet } from 'react-router';
import { NavBar } from '@/components/navbar';
import { useAuth } from '@/components/auth/AuthProvider';
import { Auth } from '@/pages/Auth';

export function Container() {
  const { user } = useAuth();
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-white text-black dark:bg-zinc-800 dark:text-white">
      {user ? (
        <div>
          <NavBar />
          <main className="m-5 flex items-center justify-center">
            <Outlet />
          </main>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen pt-7">
          <Auth />
        </div>
      )}
    </div>
  );
}
