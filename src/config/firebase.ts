import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyDTBxVDAukVBYp0pw7pVEIFk5ZMHNhkmZM",
//   authDomain: "artistapp-demo.firebaseapp.com",
//   projectId: "artistapp-demo",
//   storageBucket: "artistapp-demo.firebasestorage.app",
//   messagingSenderId: "165877906268",
//   appId: "1:165877906268:web:a11ee7315f932f4433df99"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAzFxu5O-TYc-Whg7GzEBbB3BICi6X-GVI",
  authDomain: "frame-globe.firebaseapp.com",
  projectId: "frame-globe",
  storageBucket: "frame-globe.firebasestorage.app",
  messagingSenderId: "400530693732",
  appId: "1:400530693732:web:3451bae21698bb235f8971",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;