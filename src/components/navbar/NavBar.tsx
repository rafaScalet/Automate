import { Icon } from '@iconify/react';
import { useAuth } from '@/components/auth/AuthProvider';
import { NavButton } from './NavButton';

export function NavBar() {
  const { logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between gap-6 bg-neutral-200 p-3 dark:bg-zinc-900">
      <div className="flex gap-6">
        <NavButton to="/">Dashboard</NavButton>
        <NavButton to="/new">Cadastrar Lixeira</NavButton>
      </div>
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2 rounded px-3 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-zinc-800"
      >
        <Icon icon="lucide:log-out" className="h-5 w-5" />
        Sair
      </button>
    </nav>
  );
}
