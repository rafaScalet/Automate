import type { User, UserCredential } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
  ) => Promise<UserCredential>;
  loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
}
