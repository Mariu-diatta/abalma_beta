// --- Imports Firebase ---
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleLogin } from '@react-oauth/google';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    RecaptchaVerifier
} from "firebase/auth";
import api from "./services/Axios";



// Exemple d'utilisation (dans une fonction déclenchée par un bouton "Envoyer")
// envoyerMessage("Bonjour !", "votre_id_utilisateur", "Votre Nom", "url_photo", "id_conversation");

// --- Configuration Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyD4yuvUrHj4CZlCm5Y8o-dHd-SZIz2fHss",
    authDomain: "abalma-2a66b.firebaseapp.com",
    projectId: "abalma-2a66b",
    storageBucket: "abalma-2a66b.appspot.com",
    messagingSenderId: "154955455828",
    appId: "1:154955455828:web:b6136ff230e0446435bcc1",
    measurementId: "G-9M0NF0XQZE"
};

// --- Initialisation Firebase ---
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);


export function LoginWithGoogle() {

    const handleLogin = async (credentialResponse) => {

        try {
            const res = await api.post("auth/google-login/", {
                access_token: credentialResponse.credential, // token JWT Google
            }
            );

            console.log("Connexion réussie :", res.data);
            // Sauvegarder token ou rediriger...
        } catch (err) {
            console.error("Erreur de connexion :", err);
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleLogin}
            onError={() => {
                console.log("Erreur lors de la connexion Google");
            }}
        />
    );
}

// --- Authentification Email / Mot de passe ---
export const signUpWithEmail = async ({ email, password }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Utilisateur inscrit:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Erreur d'inscription:", error.message);
        throw error;
    }
};

export const signInWithEmailPswd = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Connexion réussie:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Erreur de connexion:", error.message);
        throw error;
    }
};

// --- Connexion avec Google ---
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const resultUser = await signInWithPopup(auth, provider).then((result) => {
            // Auth réussie
            console.log("Utilisateur connecté", result);
            })
            .catch((error) => {
                if (error.code === "auth/popup-closed-by-user") {
                    console.warn("Connexion annulée par l’utilisateur.");
                } else {
                    console.error("Erreur Google Auth:", error);
                }
            });

        const user = resultUser;

        console.log("Connexion Google réussie:", user);

        return user;

    } catch (error) {
        console.error("Erreur Google Auth:", error.message);
        throw error;
    }
};

// --- Connexion avec Facebook ---
export const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Connexion Facebook réussie:");
        return user;
    } catch (error) {
        console.error("Erreur Facebook Auth:", error.message);
        throw error;
    }
};

// --- Connexion avec Twitter ---
export const signInWithTwitter = async () => {
    const provider = new TwitterAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Connexion Twitter réussie:");
        return user;
    } catch (error) {
        console.error("Erreur Twitter Auth:", error.message);
        throw error;
    }
};

// --- reCAPTCHA (SMS Auth) ---
export const setupRecaptcha = (containerId = "recaptcha-container") => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
            size: "invisible",
            callback: (response) => {
                console.log("reCAPTCHA validé");
            },
        }, auth);
    }
};

// --- Suivi Authentification ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Utilisateur connecté:", user.uid);
    } else {
        console.log("Utilisateur déconnecté");
    }
});

// --- Exports ---
export { auth, db, analytics };
