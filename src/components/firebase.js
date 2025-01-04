// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDtrKNfsXmbCmoEHB6QmMbwrnBFr2N1764",
    authDomain: "heidel-ai-auth.firebaseapp.com",
    projectId: "heidel-ai-auth",
    storageBucket: "heidel-ai-auth.firebasestorage.app",
    messagingSenderId: "155361338390",
    appId: "1:155361338390:web:88016576d8751fa848c137",
    measurementId: "G-2FC3PXQS9C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword  };
