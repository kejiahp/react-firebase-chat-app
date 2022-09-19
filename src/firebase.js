import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD-SSmrjTfha6jMmsZx_q9Od3aZvCjPh_g",
  authDomain: "react-chat-app-223c0.firebaseapp.com",
  projectId: "react-chat-app-223c0",
  storageBucket: "react-chat-app-223c0.appspot.com",
  messagingSenderId: "398044348099",
  appId: "1:398044348099:web:2dc67061d756285f0aac76"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();