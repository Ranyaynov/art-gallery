// Fichier qui créé les cartes des artistes / oeuvres

// On appelle la fonction de notre service
async function afficherGalerie() {
    // On va chercher les données via le service
    const oeuvres = await fetchArtworks();

    // On cible notre grille HTML
    const galleryGrid = document.querySelector('.gallery-grid');

    // On crée le HTML pour chaque œuvre
    oeuvres.forEach(oeuvre => {
        galleryGrid.innerHTML += `
    <article class="art-card">
        <img src="${oeuvre.image}" alt="Peinture de ${oeuvre.artiste}">
        <h2>${oeuvre.titre}</h2>
        <p>Par : ${oeuvre.artiste}</p>
    </article>
`;
        // ... (Création des <article>, <img>, <h2>, etc.)
    });
}

// On lance la fonction au chargement de la page
afficherGalerie();