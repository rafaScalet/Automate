import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAoKkjXuo7X76hlkssJ80W5GeIMYEKvCQ4',
  authDomain: 'automate-52c0d.firebaseapp.com',
  databaseURL: 'https://automate-52c0d-default-rtdb.firebaseio.com',
  projectId: 'automate-52c0d',
  storageBucket: 'automate-52c0d.firebasestorage.app',
  messagingSenderId: '432746830582',
  appId: '1:432746830582:web:b5fed02922c2b6491a2ad7',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o Banco de Dados para usar no resto do site
export const db = getDatabase(app);
