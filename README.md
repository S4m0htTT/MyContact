# MyContact

**MyContact** est une application permettant d’enregistrer et de gérer les contacts d’un utilisateur via une interface web et une API sécurisée.

---

## Structure du dépôt

Ce projet est organisé sous forme de **monorepo** comprenant deux sections principales :

- `front/` → Contient la partie **Front-end** développée avec React
- `back/` → Contient la partie **Back-end** développée avec Express

Chaque section possède son propre fonctionnement et configuration.

---

## Technologies utilisées

### Front-end

- [React](https://react.dev/) avec [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/) pour les appels API
- [React Router DOM](https://www.npmjs.com/package/react-router-dom) pour la navigation
- [Tailwind CSS](https://tailwindcss.com/) pour le style
- [Zustand](https://zustand-demo.pmnd.rs/) pour la gestion d’état

### Back-end

- [Node.js](https://nodejs.org/) avec [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) pour la base de données
- [Swagger](https://swagger.io/) pour la documentation de l’API
- [JWT](https://jwt.io/) pour l’authentification
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) pour le hachage des mots de passe

---

## Setup du projet (back)

### Prérequis

- Node.js ≥ 18
- pnpm ≥ 8
- MongoDB local ou distant
- Fichier `.env` à la racine du dossier `back/`

### Fichier d'environnement
```txt
MONGODB_URI=URL_BASE_MONGO
ADMIN_JWT_SECRET=SECRET_KEY
```

### Installation des dépendances

```bash
pnpm install
```

### Scripts
| Script              | Description                                   |
|---------------------|-----------------------------------------------|
| `pnpm install`      | Installe les dépendances      |
| `pnpm dev`          | Lance l'API en mode développement             |
| `pnpm build`        | Compile le projet TypeScript                  |
| `pnpm start`        | Lance le backend compilé (`dist/index.js`)    |
| `pnpm test`         | Lance les tests unitaires avec Jest           |
| `pnpm render-build` | Installe les dépendances et build pour Render |

---

## Setup du projet (front)

### Prérequis

- Node.js ≥ 18
- npm ≥ 9
- Fichier `.env` à la racine du dossier `front/`

### Fichier d'environnement
```txt
VITE_API_URL=API_URL
```

### Installation des dépendances

```bash
npm install
```

### Scripts
| Script           | Description                         |
|------------------|-------------------------------------|
| `npm run dev`    | Lance l'application React (Vite)    |
| `npm run build`  | Build de production                 |
| `npm run preview`| Prévisualisation du build           |
| `npm run lint`   | Analyse statique avec ESLint        |

---

## Endpoints principaux (API REST)

| Méthode | URL               | Description                                  | Authentification |
|---------|-------------------|----------------------------------------------|------------------|
| `POST`  | `/auth/login`     | Authentifier un utilisateur                  | ❌               |
| `POST`  | `/auth/register`  | Créer un nouvel utilisateur                  | ❌               |
| `GET`   | `/auth/me`        | Récupérer les infos de l'utilisateur         | ✅               |
| `GET`   | `/contacts`       | Récupérer tous les contacts de l'utilisateur | ✅               |
| `GET`   | `/contact/:id`    | Récupérer un contact par son ID              | ✅               |
| `POST`  | `/contact`        | Créer un nouveau contact                     | ✅               |
| `PATCH` | `/contact/:id`    | Mettre à jour un contact                     | ✅               |
| `DELETE`| `/contact/:id`    | Supprimer un contact                         | ✅               |

> Les endpoints marqués ✅ nécessitent un header `Authorization: Bearer <token>`

---

## Identifiants de test

Ces identifiants peuvent être utilisés pour tester l’authentification et accéder aux endpoints protégés de l’API.

| Email            | Mot de passe   |
|------------------|----------------|
| `test@test.test` | `z5B?nR@KYz`   |

---

## URLs de développement et de production

| Environnement | Frontend                             | Backend API                                  | Documentation Swagger                          |
|---------------|--------------------------------------|----------------------------------------------|------------------------------------------------|
| Développement | `http://localhost:5173`              | `http://localhost:5002/v1/api`               | `http://localhost:5002/api-docs`               |
| Production    | `https://my-contact-sand.vercel.app` | `https://mycontact-az5e.onrender.com/v1/api` | `https://mycontact-az5e.onrender.com/api-docs` |

> ℹ️ **Note importante sur l’environnement Render** :  
Lorsqu’elle n’est pas sollicitée pendant un certain temps, l’API hébergée sur Render peut être mise en veille automatiquement.  
Cela signifie que la **première requête** effectuée après une période d’inactivité peut prendre **plusieurs secondes** à répondre.  
Ce comportement est normal et ne reflète pas un dysfonctionnement du backend.

