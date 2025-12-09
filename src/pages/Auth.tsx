import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { notify } from '@/components/ui/notify';

export function Auth({ children }: { children?: React.ReactNode }) {
  const { user, signInWithGoogle, logout, loginWithEmail, registerWithEmail } =
    useAuth();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    //TODO Terminar de colocar a autenticação com email e senha
    try {
      if (!isRegister) {
        await loginWithEmail(form.email, form.password);
      } else {
        form.password !== form.passwordConfirm &&
          notify('As senhas não coincidem', 'error');
        await registerWithEmail(form.email, form.password);
      }
    } catch (error) {
      console.log('Erro ao autenticar com email e senha', error);
      notify('Erro ao autenticar com email e senha', 'error');
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

              {isRegister && (
                <Input
                  id="password"
                  label="Senha:"
                  placeholder="Digite sua senha novamente"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(e) =>
                    setForm({ ...form, passwordConfirm: e.target.value })
                  }
                  required
                />
              )}
              <Button type="submit" className="w-full" loading={loading}>
                {isRegister ? 'Cadastrar' : 'Entrar'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-gray-300 border-t dark:border-zinc-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500 dark:bg-zinc-900">
                  ou
                </span>
              </div>
            </div>

            <Button variant="ghost" onClick={signInWithGoogle}>
              Entrar com google <Icon icon={'flat-color-icons:google'} />
            </Button>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="text-center text-gray-600 text-sm transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister
                  ? 'Já tem conta? Faça login'
                  : 'Novo por aqui? Crie uma conta'}
              </button>
              <button
                type="button"
                className="text-center text-gray-600 text-sm transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                onClick={() => alert('Funcionalidade não implementada')}
              >
                Esqueci minha senha
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
