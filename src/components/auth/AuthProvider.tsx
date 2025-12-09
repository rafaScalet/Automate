import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType } from '@/components/auth/AuthContextType';
import { notify } from '@/components/ui/notify';
import { auth, googleProvider } from '@/firebaseConfig';
import { Loading } from '../ui/Loading';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        notify(`Bem-vindo, ${currentUser.displayName}!`, 'success');
      } else {
        notify('Você saiu com sucesso.', 'info');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log('Erro ao autenticar com Google', error);
      notify('Erro ao autenticar com Google', 'error');
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithEmail = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Erro ao sair', error);
      notify('Erro ao sair');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    logout,
    registerWithEmail,
    loginWithEmail,
  };
  return (
    <AuthContext.Provider value={value}>
      <div>{loading ? <Loading /> : children}</div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
