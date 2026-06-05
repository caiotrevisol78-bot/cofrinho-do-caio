import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmLjrTChSgH1PW0591hUtIej8W31C-d38",
  authDomain: "cofrinho-do-caio.firebaseapp.com",
  projectId: "cofrinho-do-caio",
  storageBucket: "cofrinho-do-caio.firebasestorage.app",
  messagingSenderId: "352367776643",
  appId: "1:352367776643:web:583acd6868e7d811dc5cb6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
