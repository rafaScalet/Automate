import { Icon } from '@iconify/react';
import { onValue, ref, remove, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import { type TrashItem, TrashList } from '@/components/registration/TrashList';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { db } from '@/firebaseConfig';
import { notify } from '@/components/ui/notify';

interface FirebaseLixeiraNode {
  config?: {
    nome?: string;
    alturaTotal?: number;
    alturaTampa?: number;
    localizacao?: {
      lat?: number;
      lng?: number;
    };
  };
  leituras?: {
    anterior?: {
      timestamp?: number;
      valor?: number;
    };
    atual?: {
      timestamp?: number;
      valor?: number;
    };
  };
}

export function Registration() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [list, setList] = useState<TrashItem[]>([]);
  const [form, setForm] = useState<TrashItem>({
    sensorId: '',
    nome: '',
    latitude: '',
    longitude: '',
    alturaTotal: '',
    alturaTampa: '',
  });

  // 1. Ler dados do Firebase (Read)
  useEffect(() => {
    const lixeirasRef = ref(db, 'lixeiras/');
    const unsubscribe = onValue(lixeirasRef, (snap) => {
      const data = snap.val();

      if (!data) {
        setList([]);
        return;
      }

      // Transforma o objeto do Firebase em array compatível com TrashItem
      const formattedList: TrashItem[] = Object.entries(data).map(
        ([key, value]) => {
          const node = value as FirebaseLixeiraNode;
          return {
            sensorId: key,
            nome: node.config?.nome || 'Sem nome',
            latitude: String(node.config?.localizacao?.lat || ''),
            longitude: String(node.config?.localizacao?.lng || ''),
            alturaTotal: String(node.config?.alturaTotal || ''),
            alturaTampa: String(node.config?.alturaTampa || ''),
          };
        },
      );

      setList(formattedList);
    });

    return () => unsubscribe();
  }, []);

  // 2. Enviar/Atualizar dados (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Salva no caminho: lixeiras/{ID}/config
      await update(ref(db, `lixeiras/${form.sensorId}`), {
        config: {
          nome: form.nome,
          localizacao: {
            lat: Number(form.latitude),
            lng: Number(form.longitude),
          },
          alturaTotal: Number(form.alturaTotal),
          alturaTampa: Number(form.alturaTampa),
          updatedAt: Date.now(),
        },
        leituras: {
          anterior: {
            timestamp: 0,
            valor: 0,
          },
          atual: {
            timestamp: 0,
            valor: 0,
          },
        },
      });

      notify(
        isEditing
          ? 'Lixeira atualizada com sucesso!'
          : 'Lixeira cadastrada com sucesso!',
      );
      resetForm();
    } catch (error) {
      console.error(error);
      notify('Erro ao salvar lixeira', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Deletar (Delete)
  const handleDelete = async (id: string) => {
    if (confirm(`Tem certeza que deseja apagar a ${id}?`)) {
      try {
        await remove(ref(db, `lixeiras/${id}`));
        notify('Lixeira removida com sucesso!', 'success');
      } catch (_error) {
        notify('Erro ao deletar lixeira', 'error');
      }
    }
  };

  // 4. Preparar edição
  const handleEdit = (item: TrashItem) => {
    setForm(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela
  };

  // 5. Resetar formulário
  const resetForm = () => {
    setForm({
      sensorId: '',
      nome: '',
      latitude: '',
      longitude: '',
      alturaTotal: '',
      alturaTampa: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-4xl space-y-8 p-4">
      {/* Formulário de Cadastro/Edição */}
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold text-2xl dark:text-white">
            <Icon
              icon={isEditing ? 'lucide:pencil' : 'lucide:plus-circle'}
              className="text-green-600"
            />
            {isEditing ? 'Editar Lixeira' : 'Nova Lixeira'}
          </h2>
          {isEditing && (
            <Button variant="ghost" onClick={resetForm}>
              Cancelar Edição
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="sensorId"
              label="ID do Sensor"
              placeholder="Ex: Lixeira0"
              value={form.sensorId}
              onChange={(e) => setForm({ ...form, sensorId: e.target.value })}
              disabled={isEditing}
              required
              helperText="Deve ser igual ao código do Arduino."
            />
            <Input
              id="nome"
              label="Nome de Referência"
              placeholder="Ex: Praça Central"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="alt"
              label="Altura (cm)"
              placeholder="Ex: 100cm"
              type="number"
              value={form.alturaTotal}
              min={0}
              onChange={(e) =>
                setForm({ ...form, alturaTotal: e.target.value })
              }
              required
            />
            <Input
              id="alt"
              label="Altura Tampa (cm)"
              placeholder="Ex: 14cm"
              type="number"
              value={form.alturaTampa}
              min={0}
              onChange={(e) =>
                setForm({ ...form, alturaTampa: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="lat"
              label="Latitude"
              placeholder="Ex: -23.5503"
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            />
            <Input
              id="lng"
              label="Longitude"
              placeholder="Ex: -46.6342"
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            variant="primary"
          >
            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </form>
      </Card>

      {/* Lista de Lixeiras */}
      <TrashList items={list} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
