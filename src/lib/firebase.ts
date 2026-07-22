import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId:
//     process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const firebaseConfig = {

  apiKey: "AIzaSyBPIPl14DE3sdxjXkbMa_YNycq_OHhwOGM",

  authDomain: "personalized-learning-sy-ea488.firebaseapp.com",

  projectId: "personalized-learning-sy-ea488",

  storageBucket: "personalized-learning-sy-ea488.firebasestorage.app",

  messagingSenderId: "512355957770",

  appId: "1:512355957770:web:dbe83c3d2dc858b91bf3f3",

  measurementId: "G-112PSKB987"

};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
console.log(firebaseConfig);