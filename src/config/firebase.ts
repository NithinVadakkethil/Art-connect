import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTBxVDAukVBYp0pw7pVEIFk5ZMHNhkmZM",
  authDomain: "artistapp-demo.firebaseapp.com",
  projectId: "artistapp-demo",
  storageBucket: "artistapp-demo.firebasestorage.app",
  messagingSenderId: "165877906268",
  appId: "1:165877906268:web:a11ee7315f932f4433df99"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;