import { NavButton } from './NavButton';

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 flex w-full gap-6 bg-neutral-200 p-3 dark:bg-zinc-900">
      <NavButton to="/">Dashboard</NavButton>
      <NavButton to="/new">New Trash</NavButton>
    </nav>
  );
}
