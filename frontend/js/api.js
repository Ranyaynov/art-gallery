const API_URL = 'http://localhost:3000/api';

const getArtworks = async (page = 1, limit = 100) => {
    try {
        const response = await fetch(
            `${API_URL}/artworks?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des œuvres :', error);
        throw error;
    }
};

const getArtistes = async (page = 1, limit = 100) => {
    try {
        const response = await fetch(
            `${API_URL}/artistes?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes :', error);
        throw error;
    }
};

export {
    getArtworks,
    getArtistes
};