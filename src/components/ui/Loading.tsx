import { Icon } from '@iconify/react';

export function Loading() {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <Icon icon="lucide:loader-2" className="animate-spin" />
      Carregando...
    </div>
  );
}
