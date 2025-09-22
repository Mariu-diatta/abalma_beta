// --- Imports Firebase ---
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // 
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    //FacebookAuthProvider,
    TwitterAuthProvider,
    RecaptchaVerifier
} from "firebase/auth";
import api from "./services/Axios";
import { login, updateCompteUser, updateUserData} from "./slices/authSlice";
import { setCurrentNav } from "./slices/navigateSlice";
import { useDispatch } from "react-redux";
import { showMessage } from "./components/AlertMessage";
import { useState } from "react";
import LoadingCard from "./components/LoardingSpin";


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

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const trimmed = cookie.trim();
            if (trimmed.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(trimmed.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function LoginWithGoogle() {

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (credentialResponse) => {

        const csrfToken = getCookie('csrftoken');

        setLoading(true);

        try {

            const res = await api.post("auth/google-login/",

                {

                    access_token: credentialResponse.credential,

                },
                {
                    headers: {

                        "X-CSRFToken": csrfToken
                    },

                    timeout: 10000,

                    withCredentials: false // 🔒 Cookies HttpOnly
                }
            );

            //console.log("user data", res?.data)

            // ✅ Utilisateur authentifié : le token est dans les cookies, inutile de le stocker
            dispatch(updateCompteUser(res?.data?.compte))

            dispatch(updateUserData(res?.data));

            dispatch(login(res.data?.user)); // user info uniquement

            dispatch(setCurrentNav("account_home"));

            navigate("/account_home", { replace: true });


        } catch (err) {

            console.log("Erreur", err)

            showMessage(

                dispatch,

                {

                    Type: "Erreur",

                    Message: `${err?.message || err?.response?.data?.detail || err?.response?.data?.detail?.error}`
                }
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <>
            {
                !loading ? (

                    <GoogleLogin
                        onSuccess={handleLogin}
                        onError={() => {
                            showMessage(dispatch, {
                                Type: "Erreur",
                                Message: "Échec de la connexion avec Google"
                            });
                        }}
                    />
                ) 
                : 
                (
                    <LoadingCard />
                )
            }
        </>
    );
}

// --- Authentification Email / Mot de passe ---
export const signUpWithEmail = async ({ email, password }) => {

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        //console.log("Utilisateur inscrit:", userCredential.user);
        return userCredential.user;

    } catch (error) {
        //console.error("Erreur d'inscription:", error.message);
        throw error;
    }
};

export const signInWithEmailPswd = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //console.log("Connexion réussie:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        //console.error("Erreur de connexion:", error.message);
        throw error;
    }
};

// --- Connexion avec Google ---
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const resultUser = await signInWithPopup(auth, provider).then((result) => {
            // Auth réussie
            //console.log("Utilisateur connecté", result);
            })
            .catch((error) => {
                if (error.code === "auth/popup-closed-by-user") {
                    console.warn("Connexion annulée par l’utilisateur.");
                } else {
                    console.error("Erreur Google Auth:", error);
                }
            });

        const user = resultUser;

        //console.log("Connexion Google réussie:", user);

        return user;

    } catch (error) {
        //console.error("Erreur Google Auth:", error.message);
        throw error;
    }
};

// --- Connexion avec Facebook ---
//const provider = new FacebookAuthProvider();
//signInWithPopup(auth, provider).then(async (result) => {
//    const credential = FacebookAuthProvider.credentialFromResult(result);
//    const accessToken = credential.accessToken;

//    // Appel backend Django avec le token
//    await api.post('https://ton-backend.com/auth/facebook-login/', {
//        access_token: accessToken
//    });
//});

// --- Connexion avec Twitter ---
export const signInWithTwitter = async () => {
    const provider = new TwitterAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        //console.log("Connexion Twitter réussie:");
        return user;
    } catch (error) {
        //console.error("Erreur Twitter Auth:", error.message);
        throw error;
    }
};

// --- reCAPTCHA (SMS Auth) ---
export const setupRecaptcha = (containerId = "recaptcha-container") => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
            size: "invisible",
            callback: (response) => {
                //console.log("reCAPTCHA validé");
            },
        }, auth);
    }
};

// --- Suivi Authentification ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        //console.log("Utilisateur connecté:", user.uid);
    } else {
        //console.log("Utilisateur déconnecté");
    }
});

// --- Exports ---
export { auth, db, analytics };
