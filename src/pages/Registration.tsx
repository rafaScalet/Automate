import { Icon } from '@iconify/react';
import { onValue, ref, remove, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import { type TrashItem, TrashList } from '@/components/registration/TrashList';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { db } from '@/firebaseConfig';

interface FirebaseLixeiraNode {
  config?: {
    nome?: string;
    alturaTotal?: number;
    localizacao?: {
      lat?: number;
      lng?: number;
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
      await update(ref(db, `lixeiras/${form.sensorId}/config`), {
        nome: form.nome,
        localizacao: {
          lat: Number(form.latitude),
          lng: Number(form.longitude),
        },
        alturaTotal: Number(form.alturaTotal),
        updatedAt: Date.now(),
      });

      alert(isEditing ? 'Lixeira atualizada!' : 'Lixeira cadastrada!');
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Deletar (Delete)
  const handleDelete = async (id: string) => {
    if (confirm(`Tem certeza que deseja apagar a ${id}?`)) {
      try {
        await remove(ref(db, `lixeiras/${id}`));
      } catch (_error) {
        alert('Erro ao deletar');
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

          <div className="grid grid-cols-3 gap-4">
            <Input
              id="lat"
              label="Latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            />
            <Input
              id="lng"
              label="Longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            />
            <Input
              id="alt"
              label="Altura (cm)"
              type="number"
              value={form.alturaTotal}
              onChange={(e) =>
                setForm({ ...form, alturaTotal: e.target.value })
              }
              required
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
