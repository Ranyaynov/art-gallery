const API_URL = 'http://localhost:3001/api';

// Les routes GET reçoivent page et limit dans req.query.
async function requestCollection(route, page = 1, limit = 24) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const params = new URLSearchParams({ page, limit });
        const response = await fetch(`${API_URL}/${route}?${params}`, {
            method: 'GET',
            signal: controller.signal
        });
        if (!response.ok) throw new Error(`Le serveur a renvoyé une erreur HTTP ${response.status}.`);
        const result = await response.json();
        if (!Array.isArray(result.data)) throw new Error('Le serveur a renvoyé une liste invalide.');
        return result;
    } catch (error) {
        if (error.name === 'AbortError') throw new Error('Le serveur met trop de temps à répondre. Réessayez.');
        if (error instanceof TypeError) throw new Error('Impossible de joindre le serveur sur le port 3001. Vérifiez que le backend est lancé.');
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

const getArtworks = (page = 1, limit = 24) => requestCollection('artworks', page, limit);
async function getArtistes(page = 1, limit = 24) {
    const result = await requestCollection('artiste', page, limit);
    // La route /agents du musée contient aussi des organismes non artistes.
    return { ...result, data: result.data.filter(agent => agent.is_artist === true) };
}

export { getArtworks, getArtistes };
