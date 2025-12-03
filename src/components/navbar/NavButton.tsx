import { Icon } from '@iconify/react';
import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router';

interface NavButtonProps extends PropsWithChildren {
  to: string;
  icon?: string;
}

export function NavButton({ to, children, icon }: NavButtonProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        `flex items-center justify-center gap-1 rounded-md p-2 align-middle ${isActive ? 'bg-neutral-300 dark:bg-zinc-800' : ''}`
      }
      to={to}
    >
      {icon && <Icon icon={icon} />}
      {children}
    </NavLink>
  );
}
