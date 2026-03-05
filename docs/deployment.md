# Déploiement et Opérations (Runbook)

Ce document centralise les stratégies et instructions pour déployer le site public et le back-office du **Port Autonome de Nouadhibou (PAN)**.

## 1. Environnements (Environments Strategy)

Le projet utilise Next.js et gère les configurations via des fichiers `.env` à la racine :

- **Dev (Local)** : Utilisez `.env.development.example` en le renommant `.env.development.local`. URL locale, logs verbeux, stockage en local.
- **Preprod (Staging)** : Environnement miroir de la production pour tester les releases. Base de données isolée et "bucket" de test. Configuration dans fichier `.env.production` de preprod.
- **Prod (Production)** : Utilisez `.env.production.example`. Active le Strict SSL (`https://www.pan.mr`), rate-limiting, headers HSTS et CSP stricts, connexion via S3 (recommandé).

> **Important** : Ne committez **jamais** les fichiers `.env` contenant les clés secrètes sur Git. `pnpm install dotenv-cli` gère le cycle si nécessaire.

## 2. Déploiement (Deployment Guide)

### Exigences du Serveur
- **Node.js**: v20.x ou supérieur (géré via nvm recommandé)
- **PM2** (Process Manager) ou **Docker** (recommandé pour une scalabilité facile)
- **Nginx** (Reverse Proxy) ou Apache
- **Certbot** (SSL Let's Encrypt ou certificats institutionnels PAN)

### Build du Monorepo
1. Cloner le repo sur la machine.
2. Installer les dépendances :
   ```bash
   pnpm install --frozen-lockfile
   ```
3. Construire le site et l'admin en production :
   ```bash
   pnpm build
   ```
   *Ce processus compile le package `shared`, `apps/web` et `apps/admin` (génère HTML statiques et Server-Side routes).*

### Démarrage avec PM2
Lancez les deux instances sur des ports différents :
```bash
# Site public (Port 3000)
cd apps/web && pm2 start pnpm --name "pan-web" -- start 

# Admin Back-office (Port 3001)
cd ../admin && pm2 start pnpm --name "pan-admin" -- start 

pm2 save
```

### Configuration Nginx
Routez `www.pan.mr` vers `localhost:3000` et `admin.pan.mr` vers `localhost:3001`.
Configurez bien la redirection de `/` public vers `/fr` gérée nativement par le middleware Next.js.

## 3. Stratégie de Stockage (Document Storage Strategy)

Le système GED (Gestion Électronique des Documents) exige de stocker potentiellement des milliers de fichiers lourds (jusqu'à 10-50Mo/fichier).

- **Actuellement (Phase 1-8)** : Le stockage est assumé "local". Les fichiers sont envoyés dans `/storage/uploads/`.
- **Stratégie cible (Production Finale)** : Une solution compatible S3 est indispensable pour éviter la surcharge du serveur applicatif. Le composant Upload devra envoyer les buffers cryptographiques via AWS SDK Node.js (`aws-sdk` ou `@aws-sdk/client-s3`) vers un S3 AWS ou un **MinIO (S3 Self-hosted sur site PAN si contrainte de souveraineté des données)**.

Configurez la variable :
```env
STORAGE_DRIVER=s3
AWS_ACCESS_KEY_ID=XXX
...
```

## 4. Stratégie de Journalisation (Logging)

Les journaux (logs) sont séparés en deux niveaux :
1. **Logs d'Audits Métier (Audit Log)** : Ce sont les requêtes gérées par la base de données. Ils concernent _qui a approuvé quoi_ ou _qui a géré tel rôle_. Ils sont lisibles dans l'interface Admin `> S/Audit`.
2. **Logs Système et Erreurs Applicatives** : 
   - Par défaut : PM2 génère des logs applicatifs dans `~/.pm2/logs/pan-web-out.log` et `error.log`.
   - **Recommandation** : Utiliser un outil de type `Winston` + `Logstash/ElasticSearch (ELK)` ou `Datadog` via des variables d'environnement (`LOG_LEVEL=info`) pour superviser la latence Next.js, les 500 Internal Errors, et le suivi PM2. Mettre en place `Sentry` côté frontend pour traquer les crashs UI.
