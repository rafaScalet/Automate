import { Icon } from '@iconify/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'ghost';
  icon?: string;
}

export function Button({
  children,
  loading,
  variant = 'primary',
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'flex items-center justify-center gap-2 rounded px-4 py-2 font-bold transition-colors disabled:opacity-50';

  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    danger:
      'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400',
    ghost:
      'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Icon icon="lucide:loader-2" className="animate-spin" />
      ) : (
        icon && <Icon icon={icon} />
      )}
      {children}
    </button>
  );
}
