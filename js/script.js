/* =========================================
   MENU MOBILE
========================================= */

const menuButton = document.getElementById("menu-button");
const navLinks = document.getElementById("nav-links");

if (menuButton && navLinks) {

    menuButton.addEventListener("click", function () {

        navLinks.classList.toggle("mobile-open");

    });

}


/* =========================================
   CONFIGURATION DE L'API
========================================= */

/*
    L'adresse ci-dessous est temporaire.

    Nikita / Quentin devront nous donner
    l'adresse exacte de leur API.
*/

const API_URL = "http://localhost:3000/api/artworks";


/* =========================================
   RÉCUPÉRER LES ŒUVRES
========================================= */

async function recupererOeuvres() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Impossible de récupérer les œuvres."
            );

        }

        const oeuvres = await response.json();

        return oeuvres;

    } catch (error) {

        console.error(
            "Erreur lors de la récupération des œuvres :",
            error
        );

        return [];

    }

}


/* =========================================
   AFFICHER LES ŒUVRES À LA UNE
========================================= */

function afficherOeuvresPrincipales(oeuvres) {

    const container =
        document.getElementById("featured-artworks");

    if (!container || oeuvres.length === 0) {
        return;
    }

    container.innerHTML = "";


    oeuvres.slice(0, 3).forEach(function (oeuvre, index) {

        const article = document.createElement("article");

        article.classList.add("artwork-card");


        article.innerHTML = `

            <div class="artwork-image">

                <img
                    src="${oeuvre.image}"
                    alt="Œuvre : ${oeuvre.title}"
                >

            </div>

            <div class="artwork-info">

                <div>

                    <p class="artwork-category">
                        ${oeuvre.category || "ŒUVRE"}
                    </p>

                    <h3>
                        ${oeuvre.title}
                    </h3>

                    <p>
                        ${oeuvre.artist || "Artiste inconnu"}
                    </p>

                </div>

                <span>
                    ${String(index + 1).padStart(2, "0")}
                </span>

            </div>

        `;


        container.appendChild(article);

    });

}


/* =========================================
   RECHERCHE DANS LA COLLECTION
========================================= */

const searchButton =
    document.getElementById("search-button");

const searchInput =
    document.getElementById("search-input");


if (searchButton && searchInput) {

    searchButton.addEventListener("click", function () {

        const recherche =
            searchInput.value.toLowerCase().trim();

        const cartes =
            document.querySelectorAll(".artwork-card");


        cartes.forEach(function (carte) {

            const texte =
                carte.textContent.toLowerCase();


            if (texte.includes(recherche)) {

                carte.style.display = "";

            } else {

                carte.style.display = "none";

            }

        });

    });

}


/* =========================================
   FILTRES
========================================= */

const filtres =
    document.querySelectorAll(".filter");


filtres.forEach(function (filtre) {

    filtre.addEventListener("click", function () {

        filtres.forEach(function (element) {

            element.classList.remove("active");

        });

        filtre.classList.add("active");


        const categorie =
            filtre.dataset.filter;

        const cartes =
            document.querySelectorAll(".artwork-card");


        cartes.forEach(function (carte) {

            if (categorie === "all") {

                carte.style.display = "";

                return;

            }


            const contenu =
                carte.textContent.toLowerCase();


            if (contenu.includes(categorie)) {

                carte.style.display = "";

            } else {

                carte.style.display = "none";

            }

        });

    });

});


/* =========================================
   INITIALISATION
========================================= */

async function initialiser() {

    const oeuvres =
        await recupererOeuvres();

    afficherOeuvresPrincipales(oeuvres);

}


initialiser();