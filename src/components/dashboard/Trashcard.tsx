import { Icon } from '@iconify/react';
import { Card } from '@/components/ui/Card';

interface TrashCardProps {
  id: string;
  leitura?: number;
  config?: {
    nome?: string;
    alturaTotal?: number;
    alturaAltura?: number;
    alturaTampa?: number;
    localizacao?: { lat: number; lng: number };
  };
}

/**
 * ================================
 * MAPEAMENTO DE PERCENTUAL
 * ================================
 *
 * Converte o percentual físico real (0–100%)
 * para um percentual lógico de interface (0–120%).
 *
 *   Por quê?
 * - Evita que 100% físico signifique imediatamente "transbordando"
 * - Dá uma margem visual e lógica para ação preventiva
 *
 * Regras:
 * - 0–20%   → 0–20   (VAZIO)
 * - 20–40%  → 40–60  (NORMAL)
 * - 40–60%  → 60–80  (ATENÇÃO)
 * - 60–80%  → 80–100 (PARCIAL)
 * - 80–100% → 100–120 (CHEIO → TRANSBORDANDO)
 */
function mapRealToUiPercent(realPercent: number): number {
  if (realPercent <= 20) {
    return realPercent;
  }

  if (realPercent <= 40) {
    return 40 + ((realPercent - 20) / 20) * 20;
  }

  if (realPercent <= 60) {
    return 60 + ((realPercent - 40) / 20) * 20;
  }

  if (realPercent <= 80) {
    return 80 + ((realPercent - 60) / 20) * 20;
  }

  return 100 + ((realPercent - 80) / 20) * 20;
}

export function TrashCard({ id, leitura = 0, config }: TrashCardProps) {
  // =====================================================
  // CONFIGURAÇÕES DA LIXEIRA
  // =====================================================
  const alturaTotal = config?.alturaTotal ?? 100;
  const nome = config?.nome || `Sensor (${id})`;

  /**
   * Altura da tampa:
   * - Preferimos alturaTampa
   * - Se não existir, usamos o campo antigo alturaAltura
   */
  const alturaTampa = config?.alturaTampa ?? config?.alturaAltura ?? 0;

  /**
   * Altura útil:
   * Parte real onde o lixo pode ocupar
   * (altura total - altura da tampa)
   */
  const usableHeight = Math.max(0, alturaTotal - alturaTampa);

  // =====================================================
  // TRATAMENTO DA LEITURA DO SENSOR
  // =====================================================
  // Garantimos que a leitura fique dentro do intervalo válido
  let sensorReading = leitura;
  if (sensorReading < 0) sensorReading = 0;
  if (sensorReading > usableHeight) sensorReading = usableHeight;

  /**
   * Altura ocupada pelo lixo
   * (quanto menor a leitura, mais cheia está a lixeira)
   */
  const occupiedHeight = Math.max(0, usableHeight - sensorReading);

  // =====================================================
  // CÁLCULO DE PERCENTUAIS
  // =====================================================

  /**
   * Percentual físico real (0–100)
   * Baseado puramente na proporção de lixo na área útil
   */
  const realPercent =
    usableHeight > 0 ? Math.round((occupiedHeight / usableHeight) * 100) : 0;

  // Segurança para evitar valores fora do intervalo
  const safeRealPercent = Math.max(0, Math.min(100, realPercent));

  /**
   * Percentual lógico exibido na UI (0–120)
   * É esse valor que o usuário vê
   */
  const percent = Math.round(mapRealToUiPercent(safeRealPercent));

  // =====================================================
  // STATUS VISUAL / CORES
  // =====================================================
  // Estado padrão (lixeira vazia ou normal)
  let statusLabel = 'VAZIO';
  let statusColor = 'text-green-600 bg-green-500';
  let borderColor = 'border-green-500';
  let bgCard = 'bg-green-50 dark:bg-green-900/10';

  /**
   * A ordem dos ifs é importante:
   * Sempre avaliamos do estado mais crítico para o mais leve
   */
  if (percent >= 120) {
    statusLabel = 'TRANSBORDANDO';
    statusColor = 'text-red-700 bg-red-700';
    borderColor = 'border-red-700';
    bgCard = 'bg-red-100 dark:bg-red-900/40 animate-pulse';
  } else if (percent >= 100) {
    statusLabel = 'CHEIO';
    statusColor = 'text-red-600 bg-red-500';
    borderColor = 'border-red-500';
    bgCard = 'bg-red-50 dark:bg-red-900/10';
  } else if (percent >= 80) {
    statusLabel = 'PARCIALMENTE CHEIA';
    statusColor = 'text-orange-600 bg-orange-500';
    borderColor = 'border-orange-500';
    bgCard = 'bg-orange-50 dark:bg-orange-900/10';
  } else if (percent >= 60) {
    statusLabel = 'ATENÇÃO';
    statusColor = 'text-yellow-600 bg-yellow-500';
    borderColor = 'border-yellow-500';
    bgCard = 'bg-yellow-50 dark:bg-yellow-900/10';
  } else if (percent >= 40) {
    statusLabel = 'NORMAL';
  }

  return (
    <Card
      className={`relative overflow-hidden border-l-4 transition-all hover:shadow-md ${borderColor} ${bgCard}`}
    >
      {/* Cabeçalho */}
      <div className="mb-4 flex items-start justify-between">
        <div className="overflow-hidden">
          <h3 className="truncate pr-2 font-bold text-black text-lg dark:text-white">
            {nome}
          </h3>
          <span className="font-mono text-xs opacity-70">ID: {id}</span>
        </div>

        {/* Ícone de alerta aparece a partir de 80% */}
        {percent >= 80 && (
          <Icon
            icon="lucide:alert-triangle"
            className={`h-6 w-6 text-red-600 ${
              percent >= 120 ? 'animate-bounce' : 'animate-pulse'
            }`}
          />
        )}
      </div>

      {/* Percentual e status */}
      <div className="flex flex-col items-center justify-center py-2">
        <span className={`font-black text-5xl ${statusColor.split(' ')[0]}`}>
          {percent}%
        </span>
        <span className="mt-1 font-bold text-sm uppercase tracking-wider opacity-70 dark:text-white">
          {statusLabel}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-700">
        <div
          className={`h-full transition-all duration-1000 ease-out ${
            statusColor.split(' ')[1]
          }`}
          style={{ width: `${Math.min(percent, 120)}%` }}
        />
      </div>

      {/* Informações técnicas */}
      <div className="mt-4 flex items-center justify-between border-gray-200 border-t pt-3 text-xs opacity-70 dark:border-zinc-700 dark:text-gray-300">
        <div className="flex flex-col">
          <span>Leitura: {leitura.toFixed(1)} cm</span>
          <span>Total: {alturaTotal} cm</span>
          <span>Tampa: {alturaTampa} cm</span>
          <span>Útil: {usableHeight} cm</span>
          <span>Físico: {safeRealPercent}%</span>
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
