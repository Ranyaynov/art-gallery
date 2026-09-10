// Le backend local doit accepter page et limit dans req.query.
const API_URL = 'http://localhost:3000/api';

const getArtworks = async (page = 1, limit = 24) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const response = await fetch(
            `${API_URL}/artworks?page=${page}&limit=${limit}`,
            { signal: controller.signal }
        );
        if (!response.ok) {
            throw new Error(`Le backend a renvoyé une erreur HTTP ${response.status}. Vérifiez que /api/artworks lit page et limit dans req.query.`);
        }
        const result = await response.json();
        if (!Array.isArray(result.data)) {
            throw new Error('Le backend a renvoyé un format inattendu : la liste data est absente.');
        }
        return result;
    } catch (error) {
        if (error.name === 'AbortError') throw new Error('Le serveur met trop de temps à répondre. Réessayez.');
        if (error instanceof TypeError) throw new Error('Impossible de joindre le backend sur http://localhost:3000. Vérifiez son démarrage et la configuration CORS.');
        throw error;
    } finally {
        clearTimeout(timeout);
    }
};

// Aucune route de liste des artistes n'existe : on utilise les crédits des œuvres.
const getArtistes = async (page = 1, limit = 24) => {
    const result = await getArtworks(page, limit);
    const artists = new Map();
    result.data.forEach(artwork => {
        const names = artwork.artist_titles?.length ? artwork.artist_titles : [artwork.artist_title];
        const ids = artwork.artist_ids || [];
        names.forEach((name, index) => {
            if (!name) return;
            const id = ids[index] ?? (index === 0 ? artwork.artist_id : null);
            const key = id == null ? name : String(id);
            if (!artists.has(key)) artists.set(key, { id, title: name, artworks: [] });
            artists.get(key).artworks.push(artwork);
        });
    });
    return { ...result, data: [...artists.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr')) };
};

export { getArtworks, getArtistes };
