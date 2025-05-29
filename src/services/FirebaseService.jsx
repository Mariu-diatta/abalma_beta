interface RequestData {
    title: string;
    content: string;
    // Ajouter ici d'autres champs si n�cessaire
}

interface ApiError {
    error: string;
    [key: string]: any;
}

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Envoie des donn�es � Django en incluant le token Firebase dans les en-t�tes.
 */
export async function sendDataToDjango(
    endpoint: string,
    data: RequestData,
    idToken: string,
    method: 'POST' | 'PUT' | 'PATCH' = 'POST'
): Promise<any> {
    if (!idToken) {
        console.error("Token Firebase introuvable.");
        throw new Error("Vous devez �tre connect� pour effectuer cette action.");
    }

    const url = `${API_BASE_URL}/${endpoint}/`;

    const requestOptions: RequestInit = {
        method,
        headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type') || '';
            let errorDetails: ApiError = { error: response.statusText };

            if (contentType.includes('application/json')) {
                errorDetails = await response.json();
            }

            throw new Error(`Erreur API ${response.status}: ${errorDetails.error}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Erreur de communication avec l'API Django:", err);
        throw err;
    }
}
