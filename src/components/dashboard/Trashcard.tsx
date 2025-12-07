import { Icon } from '@iconify/react';
import { Card } from '@/components/ui/Card';

interface TrashCardProps {
  id: string;
  leitura?: number;
  config?: {
    nome?: string;
    alturaTotal?: number;
    localizacao?: { lat: number; lng: number };
  };
}

export function TrashCard({ id, leitura = 0, config }: TrashCardProps) {
  // Configurações padrão se não houver cadastro
  const alturaTotal = config?.alturaTotal || 100;
  const nome = config?.nome || `Sensor (${id})`;

  // Lógica de porcentagem (Inversa: Sensor mede vazio)
  const alturaLixo = alturaTotal - leitura;
  let percent = Math.round((alturaLixo / alturaTotal) * 100);

  // Limites seguros
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  // Status visual
  let statusColor = 'text-green-600 bg-green-500';
  let borderColor = 'border-green-500';
  let bgCard = 'bg-green-50 dark:bg-green-900/10';

  if (percent >= 50) {
    statusColor = 'text-yellow-600 bg-yellow-500';
    borderColor = 'border-yellow-500';
    bgCard = 'bg-yellow-50 dark:bg-yellow-900/10';
  }
  if (percent >= 80) {
    statusColor = 'text-red-600 bg-red-500';
    borderColor = 'border-red-500';
    bgCard = 'bg-red-50 dark:bg-red-900/10';
  }

  return (
    <Card
      className={`relative overflow-hidden border-l-4 transition-all hover:shadow-md ${borderColor} ${bgCard}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="truncate pr-2 font-bold text-black text-lg dark:text-white">
            {nome}
          </h3>
          <span className="font-mono text-xs opacity-70">ID: {id}</span>
        </div>
        {percent >= 80 && (
          <Icon
            icon="lucide:alert-triangle"
            className="h-6 w-6 animate-pulse text-red-500"
          />
        )}
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        <span className={`font-black text-5xl ${statusColor.split(' ')[0]}`}>
          {percent}%
        </span>
        <span className="font-medium text-sm opacity-60 dark:text-white">
          Ocupação
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-700">
        <div
          className={`h-full transition-all duration-1000 ease-out ${statusColor.split(' ')[1]}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-gray-200 border-t pt-3 text-xs opacity-70 dark:border-zinc-700 dark:text-gray-300">
        <div className="flex flex-col">
          <span>Leitura: {leitura.toFixed(1)} cm</span>
          <span>Total: {alturaTotal} cm</span>
        </div>

        {config?.localizacao && (
          <a
            href={`https://www.google.com/maps?q=${config.localizacao.lat},${config.localizacao.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-500 hover:underline"
          >
            <Icon icon="lucide:map-pin" />
            Mapa
          </a>
        )}
      </div>
    </Card>
  );
}
