import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// const firebaseConfig = {
//   apiKey: 'AIzaSyAoKkjXuo7X76hlkssJ80W5GeIMYEKvCQ4',
//   authDomain: 'automate-52c0d.firebaseapp.com',
//   databaseURL: 'https://automate-52c0d-default-rtdb.firebaseio.com',
//   projectId: 'automate-52c0d',
//   storageBucket: 'automate-52c0d.firebasestorage.app',
//   messagingSenderId: '432746830582',
//   appId: '1:432746830582:web:b5fed02922c2b6491a2ad7',
// };
// const firebaseConfig = {
//   apiKey: import.meta.env.API_KEY,
//   authDomain: import.meta.env.AUTH_DOMAIN,
//   databaseURL: import.meta.env.DATABASE_URL,
//   projectId: import.meta.env.PROJECT_ID,
//   storageBucket: import.meta.env.STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
//   appId: import.meta.env.APP_ID,
//   measurementId: import.meta.env.MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyAslfq6yExuo-lQXiNUA_cBsYG1jt0VlVU',
  authDomain: 'projeto-esp-f6214.firebaseapp.com',
  databaseURL: 'https://projeto-esp-f6214-default-rtdb.firebaseio.com',
  projectId: 'projeto-esp-f6214',
  storageBucket: 'projeto-esp-f6214.firebasestorage.app',
  messagingSenderId: '813371342709',
  appId: '1:813371342709:web:275c293e1f7bede73fdd3c',
  measurementId: 'G-BLS3G44XRK',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o Banco de Dados para usar no resto do site
export const db = getDatabase(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
