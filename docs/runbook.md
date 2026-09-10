# Runbook — art-gallery

Procédures de dépannage du projet. Ce document dit **comment faire** ; l'organisation en cas d'incident est dans le playbook.

**Contexte :** backend Node/Express sur `http://localhost:3000` (port codé en dur dans `backend/index.js`), pas de base de données — les œuvres viennent de l'API publique `api.artic.edu`.

> Sous Windows PowerShell, écrire `curl.exe` et non `curl`.
>
> Toujours entourer le corps JSON de guillemets **simples**. Avec des guillemets doubles, PowerShell supprime les `"` internes et le serveur renvoie une erreur `SyntaxError`.

---

## 1. Vérifier que le backend tourne

```bash
curl.exe -i -X GET http://localhost:3000/api/artworks -H "Content-Type: application/json" -d '{\"page\":1,\"limit\":2}'
```

**Résultat attendu :** `HTTP/1.1 200 OK` + un JSON contenant `"pagination"` et `"data": [ ... ]`.

| Réponse obtenue | Aller à |
|---|---|
| `Connection refused` | Procédure 2 |
| `400 {"message":"page et limit requis"}` | Procédure 4, étape 2 |
| `500 {"message":"Response status: ..."}` | Procédure 4, étape 3 |

---

## 2. Démarrer / redémarrer le backend

1. Arrêter le backend en cours : `Ctrl + C` dans son terminal.
2. `cd backend`
3. `npm install` (seulement si `node_modules/` est absent)
4. `node index.js`

**Résultat attendu :** `Example app listening on port 3000`, le terminal reste occupé. Vérifier avec la procédure 1.

- Erreur `Cannot find module 'express'` → l'étape 3 n'a pas été faite.
- Erreur `EADDRINUSE` → procédure 3.

---

## 3. Le port 3000 est déjà occupé

**Symptôme :** `Error: listen EADDRINUSE: address already in use :::3000`

1. Trouver le processus :

   ```bash
   netstat -ano | findstr :3000
   ```

   **Résultat attendu :** une ligne `TCP  0.0.0.0:3000  ...  LISTENING  18244`. Le dernier nombre est le PID.

   `findstr :3000` remonte aussi les ports 30000 à 30009. Ne retenir que la ligne dont l'adresse locale se termine exactement par `:3000` et dont l'état est `LISTENING`.

2. Vérifier de quel programme il s'agit avant de le tuer :

   ```bash
   tasklist /FI "PID eq 18244"
   ```

   **Résultat attendu :** `node.exe`. Si c'est autre chose, ne pas le tuer → étape 4.

3. Libérer le port :

   ```bash
   taskkill /PID 18244 /F
   ```

   **Résultat attendu :** `Opération réussie : le processus avec PID 18244 a été terminé.` (ou la version anglaise `SUCCESS: ...` selon la langue de Windows). Reprendre la procédure 2.

4. **Repli** — si le port est pris par un programme à conserver : changer `const port = 3000` en `3001` dans `backend/index.js`, et mettre à jour l'URL côté frontend, sinon les œuvres ne se chargent plus.

> macOS / Linux : `lsof -i :3000` puis `kill -9 <PID>`.

---

## 4. Erreur de récupération des œuvres

**Symptôme :** galerie vide, ou erreur sur `/api/artworks` dans la console du navigateur.
Dérouler dans l'ordre, s'arrêter à la première étape qui échoue.

**Étape 1 — le backend répond-il ?**
Faire la procédure 1. `Connection refused` → procédure 2, le problème n'est pas les œuvres.

**Étape 2 — la requête est-elle bien formée ?**

Les routes lisent leurs paramètres dans le **corps** de la requête, pas dans l'URL. Deux erreurs distinctes existent, à ne pas confondre :

| Réponse | Cause | Correction |
|---|---|---|
| `500` + page HTML `TypeError: Cannot destructure property 'page' of 'req.body' as it is undefined` | L'en-tête `Content-Type: application/json` est absent. En Express 5, `req.body` vaut alors `undefined` et la déstructuration plante. | Ajouter l'en-tête à la requête |
| `500` + page HTML `SyntaxError: Expected property name` | Le corps JSON est mal formé. Sous PowerShell, c'est presque toujours un problème de guillemets. | Entourer le JSON de guillemets simples |
| `400 {"message":"page et limit requis"}` ou `{"message":"id requis"}` | L'en-tête et le JSON sont corrects, mais un champ obligatoire manque. | Compléter le corps JSON |

Requête correcte de référence :

```bash
curl.exe -X GET http://localhost:3000/api/artiste -H "Content-Type: application/json" -d '{\"id\":27992}'
```

**Résultat attendu :** `200` + le nom de l'artiste, ex. `"Georges Seurat"`.

Vérifier les mêmes points dans le `fetch` du frontend.

**Étape 3 — l'API externe répond-elle ?**
Une réponse `500 {"message":"Response status: 404"}` signifie que le backend va bien mais qu'`api.artic.edu` a refusé. Tester sans passer par le backend :

```bash
curl.exe -i "https://api.artic.edu/api/v1/artworks?page=1&limit=2"
```

| Résultat | Cause | Action |
|---|---|---|
| `200` | L'API va bien : paramètres envoyés incorrects | Corriger `page`/`limit`/`id`, refaire l'étape 2 |
| `404` | L'id d'œuvre n'existe pas | Utiliser un id valide (ex. `27992`) |
| `429` | Trop de requêtes | Attendre quelques minutes |
| Timeout | Pas d'accès Internet ou API en panne | Vérifier la connexion, réessayer |

**Étape 4 — le frontend reçoit-il la réponse ?**
Si `curl` renvoie `200` mais que la page reste vide : `F12` → onglet Console et Network, recharger.

- `Failed to fetch` → backend arrêté ou mauvaise URL appelée.
- Erreur CORS → vérifier que `app.use(cors(...))` est présent dans `backend/index.js`, puis procédure 2.
- Statut `200` mais rien à l'écran → le problème est dans le JS du frontend, pas dans le backend.

---

## Validation

Chaque procédure est exécutée par un membre qui ne l'a pas écrite, sur sa propre machine.

| Procédure | Testée par | Date | Conforme au résultat attendu ? |
|---|---|---|---|
| 1. Vérifier que le backend tourne | Fabio | 10/09/2026 | Oui |
| 2. Démarrer / redémarrer | Fabio | 10/09/2026 | Oui |
| 3. Port 3000 occupé | Fabio | 10/09/2026 | netstat, tasklist et taskkill : oui. L'erreur `EADDRINUSE` n'a pas pu être reproduite sur cette machine — à vérifier par un second testeur |
| 4. Récupération des œuvres | Fabio | 10/09/2026 | Oui |
