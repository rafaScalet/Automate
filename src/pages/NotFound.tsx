import { Icon } from '@iconify/react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-700">
        <Icon
          icon="lucide:search-x"
          className="h-12 w-12 text-gray-400 dark:text-gray-500"
        />
      </div>

      <h1 className="mb-2 font-bold text-4xl text-gray-800 dark:text-white">
        Página não encontrada
      </h1>

      <p className="mb-8 max-w-md text-gray-500 dark:text-gray-400">
        Ops! Parece que você tentou acessar uma rota que não existe ou foi
        removida.
      </p>

      <Link to="/">
        <Button variant="primary" icon="lucide:arrow-left">
          Voltar para o Dashboard
        </Button>
      </Link>
    </div>
  );
}
