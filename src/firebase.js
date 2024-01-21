import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAg6B5c92JE6jUQMNgCQgwDf2kO9QNJU3s",
    authDomain: "auth-dev-35121.firebaseapp.com",
    projectId: "auth-dev-35121",
    storageBucket: "auth-dev-35121.appspot.com",
    messagingSenderId: "80054136013",
    appId: "1:80054136013:web:2464fdf20cad3a0630cd84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };


export default app;