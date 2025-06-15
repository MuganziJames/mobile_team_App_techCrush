import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "afristyle-30827",
  appId: "1:994384172281:android:6fcf65ef2f33a5f4c4be28",
  apiKey: "AIzaSyCgR7hGtZg7JGMwXr5B536mlLatjIgEnbs",
  storageBucket: "afristyle-30827.firebasestorage.app",
  messagingSenderId: "994384172281",
  databaseURL: "https://afristyle-30827.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
export default app;