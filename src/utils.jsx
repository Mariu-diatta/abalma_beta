import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

export const handleLoginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();

        // Envoie du token au backend Django
        const res = await axios.post("http://localhost:8000/api/auth/google-login/", {
            token
        });

        console.log("Utilisateur connecté côté backend :", res.data);
    } catch (err) {
        console.error("Erreur de connexion Google:", err);
    }
};