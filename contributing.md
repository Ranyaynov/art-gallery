# Contribuer au projet

## Organisation

- Chaque tâche doit avoir une issue avec un responsable.
- Déplacer l’issue dans le tableau GitHub selon son avancement.
- Signaler les blocages dans l’issue concernée.

## Branches

- main : version stable et validée.
- dev : intégration du travail de l’équipe.
- feature/nom-de-la-tache : nouvelle fonctionnalité.
- fix/nom-du-probleme : correction.
- docs/nom-du-document : documentation.

Nous utilisons dev pour réunir et tester les contributions
avant de les intégrer dans main.

## Commencer une tâche

Partir d’une branche dev à jour :

git switch dev
git pull origin dev
git switch -c feature/nom-de-la-tache

Avant de changer de branche, vérifier avec git status
que son travail en cours est sauvegardé.

## Commits

Faire des commits courts et liés à la tâche.

Exemples :
- feat: afficher les œuvres
- fix: corriger les paramètres de pagination
- docs: ajouter le guide de contribution

Ne pas ajouter node_modules, de fichiers temporaires ou de secrets.

## Pull requests

- Ouvrir une PR vers dev.
- Indiquer l’issue concernée, les changements et les tests réalisés.
- Demander une relecture à un autre membre.
- Corriger les problèmes signalés avant la fusion.

Le reviewer vérifie le fonctionnement, la lisibilité
et la gestion des erreurs. Il indique ce qu’il a vérifié.

## Terminer une tâche

- Vérifier les critères de l’issue après intégration.
- Fermer l’issue et la déplacer dans Done si tout est terminé.
- Intégrer dev dans main par une PR après validation du site complet.