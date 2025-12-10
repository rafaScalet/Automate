import type { User, UserCredential } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
}
