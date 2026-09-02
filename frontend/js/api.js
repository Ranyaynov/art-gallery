// Fichier qui demande au serveur les données des artistes / oeuvres
async function fetchArtworks() {
    try {
        const response = await fetch('http://localhost:3000/api/oeuvres');
        const data = await response.json();
        return data; // Renvoie juste les données (images, artistes)
    } catch (error) {
        console.error("Erreur de connexion au serveur :", error);
        return [];
    }
}