# ADR 0001: Choix du language

## Context
Art Gallery est un site gallery qui a besoin d'un beaux design et un système bien solide

## Décision
### Frontend

choix: 
-HTML
-CSS
-JS

Pourquoi:
Nous avons fait le choix d'utiliser du javascripte notament pour faire des animations et rendre le site agréable à parcourir.

### Backend

Choix:
-JS

Pourquoi:
Dans un premier temps, étant donné que l'on utilise du javascripte pour les animations frontend et un json pour communiquer avec l'API, l'utilisation du javascripte pour le backend permet d'avoir un énorme écosysteme via npm.
Dans une second temps, javascripte est parfaitement adapter pour du web et permet plus de flexibilité que d'autre languages tel que golang.

## Conséquences 
Positives: 
- Beau design et interface agréable grâce à HTML, CSS et JavaScript.
- Animations et interactions faciles à mettre en place.
- Développement frontend et backend avec le même langage.

Négatives:
- Plus difficile à maintenir lorsque le projet devient important.
- JavaScript offre beaucoup de liberté, ce qui peut entraîner des erreurs si le code n'est pas bien structuré.