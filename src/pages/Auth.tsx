import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { notify } from '@/components/ui/notify';

export function Auth({ children }: { children?: React.ReactNode }) {
  const { user, loginWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(form.email, form.password);
    } catch (error) {
      console.log('Erro ao autenticar com email e senha', error);
      notify('Email ou senha incorretos', 'error');
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full items-center justify-center gap-2">
      {user ? (
        <div>{children}</div>
      ) : (
        <Card>
          <div className="flex w-96 flex-col gap-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                label="Email:"
                placeholder="Exemplo: usuario@exemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                id="password"
                label="Senha:"
                placeholder="Digite sua senha"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <Button type="submit" className="w-full" loading={loading}>
                Entrar
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
