import { getArtworks, getArtistes } from './api.js';

const loadArtworks = async () => {
    try {
        const data = await getArtworks(1, 100);

        console.log('Œuvres récupérées :', data);

        // Les œuvres sont généralement dans data.data
        if (data.data) {
            console.log(data.data);
        }
    } catch (error) {
        console.error(error);
    }
};

const loadArtistes = async () => {
    try {
        const data = await getArtistes(1, 100);

        console.log('Artistes récupérés :', data);

        // Les artistes sont généralement dans data.data
        if (data.data) {
            console.log(data.data);
        }
    } catch (error) {
        console.error(error);
    }
};

const init = async () => {
    await loadArtworks();
    await loadArtistes();
};

init();