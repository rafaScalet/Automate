import { Icon } from '@iconify/react';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { TrashCard } from '@/components/dashboard/Trashcard';
import { db } from '@/firebaseConfig';

interface Leitura {
  valor: number;
  timestamp: number;
}

interface Config {
  nome?: string;
  alturaTotal?: number;
  localizacao?: {
    lat: number;
    lng: number;
  };
}

interface LixeiraData {
  leituras?: {
    atual?: Leitura;
  };
  config?: Config;
}

type LixeirasState = Record<string, LixeiraData>;

export function Dashboard() {
  const [lixeiras, setLixeiras] = useState<LixeirasState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'lixeiras/'), (snapshot) => {
      const data = snapshot.val();
      setLixeiras(data || {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2">
        <Icon icon="lucide:loader-2" className="animate-spin" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl p-4">
      <header className="mb-8 flex flex-col items-center gap-2">
        <h1 className="flex items-center gap-3 font-bold text-3xl text-gray-800 dark:text-white">
          <Icon icon="lucide:layout-dashboard" className="text-blue-600" />
          Monitoramento Urbano
        </h1>
      </header>

      {Object.keys(lixeiras).length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          Nenhum dado recebido ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(lixeiras).map(([id, data]) => (
            <TrashCard
              key={id}
              id={id}
              leitura={data.leituras?.atual?.valor}
              config={data.config}
            />
          ))}
        </div>
      )}
    </div>
  );
}
