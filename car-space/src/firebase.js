
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCM9FeAoAm_LLJHv5LpsjrB2UKtKEWnJ1w",  // Use environment variables
    authDomain: "secondhandcarapp.firebaseapp.com",
    projectId: "secondhandcarapp",
    storageBucket: "secondhandcarapp.appspot.com",  // Fixed storage bucket
    messagingSenderId: "1067958582567",
    appId: "1:1067958582567:web:29f33628db5a4bbfedbd02",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db, RecaptchaVerifier, signInWithPhoneNumber };
