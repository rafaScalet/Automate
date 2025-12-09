import { Button } from '@/components/ui/Button';

export interface TrashItem {
  sensorId: string;
  nome: string;
  alturaTotal: string;
  alturaTampa: string;
  latitude: string;
  longitude: string;
}

interface TrashListProps {
  items: TrashItem[];
  onEdit: (item: TrashItem) => void;
  onDelete: (id: string) => void;
}

export function TrashList({ items, onEdit, onDelete }: TrashListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-gray-500 dark:border-zinc-700">
        Nenhuma lixeira cadastrada.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-neutral-200 border-b bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h3 className="font-bold text-gray-700 text-lg dark:text-gray-200">
          Lixeiras Cadastradas ({items.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-600 text-sm dark:text-gray-300">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase dark:bg-zinc-800 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">ID Sensor</th>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Altura</th>
              <th className="px-6 py-3">Tampa</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {items.map((item) => (
              <tr
                key={item.sensorId}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-6 py-4 font-medium font-mono text-blue-600 dark:text-blue-400">
                  {item.sensorId}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.nome}
                </td>
                <td className="px-6 py-4">{item.alturaTotal} cm</td>
                <td className="px-6 py-4">{item.alturaTampa} cm</td>
                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                  {/* O componente Button já cuida do ícone internamente */}
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(item)}
                    icon="lucide:pencil"
                    className="h-auto rounded-full p-2"
                  />
                  <Button
                    variant="danger"
                    onClick={() => onDelete(item.sensorId)}
                    icon="lucide:trash-2"
                    className="h-auto rounded-full p-2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
