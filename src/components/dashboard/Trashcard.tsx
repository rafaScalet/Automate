import { Icon } from '@iconify/react';
import { Card } from '@/components/ui/Card';

interface TrashCardProps {
  id: string;
  leitura?: number;
  config?: {
    nome?: string;
    alturaTotal?: number;
    // aceitamos tanto alturaAltura (se já existir) quanto alturaTampa (mais claro)
    alturaAltura?: number;
    alturaTampa?: number;
    localizacao?: { lat: number; lng: number };
  };
}

export function TrashCard({ id, leitura = 0, config }: TrashCardProps) {
  // Configurações padrão se não houver cadastro
  const alturaTotal = config?.alturaTotal ?? 100;
  const nome = config?.nome || `Sensor (${id})`;

  // --- Nova lógica baseada no seu pedido ---
  // altura da tampa (prefere alturaTampa, senão fallback para alturaAltura)
  const alturaTampa = config?.alturaTampa ?? config?.alturaAltura ?? 0;

  // altura útil (usable height) = total - tampa
  const usableHeight = Math.max(0, alturaTotal - alturaTampa);

  // Assumimos: leitura = distância medida pelo sensor desde o topo (sensor na tampa) até a superfície do lixo.
  // Portanto: occupiedHeight = usableHeight - leitura
  let sensorReading = leitura;

  // Normaliza leitura para o intervalo [0, usableHeight]
  if (sensorReading < 0) sensorReading = 0;
  if (sensorReading > usableHeight) sensorReading = usableHeight;

  const occupiedHeight = Math.max(0, usableHeight - sensorReading);

  // Percentual baseado em usableHeight (0..100)
  let percent =
    usableHeight > 0 ? Math.round((occupiedHeight / usableHeight) * 100) : 0;
  percent = Math.max(0, Math.min(100, percent));

  // Mapear status com as faixas que você sugeriu (usando percent)
  // Faixas (baseadas no seu exemplo de 40cm usable):
  // 100% -> TRANSBORDANDO
  // >=80 -> CHEIO
  // >=60 -> OCUPAÇÃO
  // >=40 -> OCUPAÇÃO (mantive o mesmo label, mas pode ajustar)
  // >=20 -> VAZIO (você usou 20% -> VAZIO no exemplo)
  // <20 -> VAZIO
  let statusLabel = 'VAZIO';
  if (percent >= 100) statusLabel = 'TRANSBORDANDO';
  else if (percent >= 80) statusLabel = 'CHEIO';
  else if (percent >= 60) statusLabel = 'PARCIALMENTE CHEIA';
  else if (percent >= 40) statusLabel = 'EM USO';
  else statusLabel = 'VAZIO';

  // Mantive a lógica de cores, mas agora baseada nas faixas que você descreveu.
  // Você pode ajustar classes Tailwind conforme preferir.
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
          {statusLabel}
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
          <span>Altura tampa: {alturaTampa} cm</span>
          <span>Altura útil: {usableHeight} cm</span>
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
