import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [isLeaving, setIsLeaving] = React.useState(false);
  const [isEntering, setIsEntering] = React.useState(true);

  useEffect(() => {
    setTimeout(() => setIsEntering(false), 50);
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success:
      'bg-gray-100 dark:bg-zinc-800 border-2 border-green-600 text-green-600',
    error: 'bg-gray-100 dark:bg-zinc-800 border-2 border-red-600 text-red-600',
    warning:
      'bg-gray-100 dark:bg-zinc-800 border-2 border-yellow-600 text-yellow-600',
    info: 'bg-gray-100 dark:bg-zinc-800 border-2 border-blue-600 text-blue-600',
  };

  const icons = {
    success: 'lucide:check-circle',
    error: 'lucide:x-circle',
    warning: 'lucide:alert-triangle',
    info: 'lucide:info',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${styles[type ?? 'success']} transition-all duration-300 ${
        isLeaving ? 'translate-x-[400px] opacity-0' : isEntering ? 'translate-x-[400px] opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <Icon icon={icons[type ?? 'success']} className="h-5 w-5" />
      <span className="font-medium">{message}</span>
      <button type="button" onClick={onClose} className="ml-2 hover:opacity-80">
        <Icon icon="lucide:x" className="h-4 w-4" />
      </button>
    </div>
  );
}
