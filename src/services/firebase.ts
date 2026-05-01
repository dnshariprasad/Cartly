import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate config
const isConfigValid = Object.values(firebaseConfig).every(val => !!val && val !== 'PLACEHOLDER');

if (!isConfigValid) {
  console.error(
    'Firebase configuration is missing or invalid. ' +
    'Please ensure you have created a .env file with all VITE_FIREBASE_* variables. ' +
    'See .env.example for required fields.'
  );
}

let app;
let auth;
let db;
let storage;
const googleProvider = new GoogleAuthProvider();

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export { auth, db, storage, googleProvider };

export default app;
