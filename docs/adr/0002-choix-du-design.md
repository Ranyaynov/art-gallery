# Choix du design

## 1. Contexte et Problème
Notre projet de galerie d'art nécessite une interface soignée, esthétique. Le code CSS peut très vite devenir chaotique, difficile à lire et créer des conflits entre les différentes pages si nous n'avons pas de règles claires. Nous devons décider comment nous allons structurer notre code de style pour ce projet.

## 2. Options envisagées
* **Option A : Utiliser du CSS Vanilla (natif) organisé**.
* **Option B : Apprendre et utiliser un framework CSS (ex: Bootstrap ou Tailwind)**. 

## 3. Décision
Nous décidons de partir sur l'**Option B : CSS Vanilla**. 
Plutôt que de risquer de perdre du temps sur l'apprentissage d'un nouvel outil, nous faisons le choix stratégique de nous appuyer sur les technologies que nous maîtrisons déjà.

### Conséquences positives
* **Plus simple pour nous :** On gagne du temps sur le démarrage du projet vu qu'on a déjà les bases en CSS.
* **Contrôle total du design :** On peut vraiment suivre notre propre charte graphique, sans devoir se battre contre le style par défaut imposé par un framework.
* **Performance :** Le site sera plus léger, car on charge uniquement le CSS dont on a vraiment besoin.

### 👎 Conséquences négatives (Risques)
* **Rigueur obligatoire :** On va devoir faire très attention au nommage de nos classes (ex: `.art-card`, `.navbar`) pour éviter que le style d'une page ne casse celui d'une autre.
* **Plus long à coder :** On devra tout faire à la main (boutons, modales, menus), ce qui prendra un peu plus de temps que d'importer des composants tout prêts.