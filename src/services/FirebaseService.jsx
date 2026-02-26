interface RequestData {
    title: string;
    content: string;
    // Ajouter ici d'autres champs si nécessaire
}

interface ApiError {
    error: string;
    [key: string]: any;
}

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Envoie des données à Django en incluant le token Firebase dans les en-têtes.
 */
export async function sendDataToDjango(
    endpoint: string,
    data: RequestData,
    idToken: string,
    method: 'POST' | 'PUT' | 'PATCH' = 'POST'
): Promise<any> {
    if (!idToken) {
        console.error("Token Firebase introuvable.");
        throw new Error("Vous devez être connecté pour effectuer cette action.");
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
                // Essaye de parser l'erreur JSON
                try {
                    errorDetails = await response.json();
                } catch {
                    // Si le parsing échoue, on garde errorDetails par défaut
                }
            }

            throw new Error(`Erreur API ${response.status}: ${errorDetails.error || response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Erreur de communication avec l'API Django:", err);
        throw err;
    }
}
