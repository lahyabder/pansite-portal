# 🚢 PAN — Port Autonome de Nouadhibou

Site web officiel et back-office d'administration du **Port Autonome de Nouadhibou** (Mauritanie).

## Architecture

```
pansite/
├── apps/
│   ├── web/              → Site public (Next.js, FR + AR/RTL)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── [locale]/     → Pages localisées (/fr/... et /ar/...)
│   │       │   └── globals.css    → Design tokens PAN
│   │       ├── components/        → Header, Footer, PageHero, ComingSoon
│   │       ├── lib/               → Dictionnaires i18n FR/AR
│   │       └── middleware.ts      → Détection de langue + redirect
│   └── admin/            → Back-office d'administration (Next.js)
│       └── src/
│           ├── app/
│           │   ├── login/          → Page de connexion
│           │   └── (dashboard)/    → Layout avec sidebar
│           │       ├── contents/   → Gestion des contenus
│           │       ├── documents/  → GED Documents
│           │       ├── services/   → Services portuaires
│           │       ├── requests/   → Demandes & requêtes
│           │       ├── users/      → Utilisateurs & rôles
│           │       ├── tenders/    → Appels d'offres
│           │       ├── medias/     → Médiathèque
│           │       ├── analytics/  → Analytique
│           │       └── settings/   → Paramètres
│           └── components/         → AdminSidebar, AdminTopbar
├── packages/
│   └── shared/           → Types, utilitaires, données mock partagés
├── pnpm-workspace.yaml
└── package.json
```

## Prérequis

- **Node.js** ≥ 20
- **pnpm** ≥ 9

## Installation

```bash
cd pansite
pnpm install
```

## Lancement

```bash
# Lancer les deux apps en parallèle
pnpm dev

# Ou individuellement :
pnpm dev:web     # → http://localhost:3000
pnpm dev:admin   # → http://localhost:3001
```

| App    | URL                   | Description                  |
|--------|-----------------------|------------------------------|
| Web    | http://localhost:3000 | Site public (FR par défaut)  |
| Admin  | http://localhost:3001 | Back-office d'administration |

## Internationalisation (i18n)

### Langues supportées

- 🇫🇷 **Français** (par défaut) : `http://localhost:3000/fr`
- 🇲🇷 **العربية** (RTL) : `http://localhost:3000/ar`

### Comment ça marche

1. **Middleware** (`apps/web/src/middleware.ts`) :
   - Détecte la langue via cookie `NEXT_LOCALE` ou l'en-tête `Accept-Language`
   - Redirige `/` → `/fr` automatiquement
   - Toutes les pages sont sous `app/[locale]/...`

2. **Dictionnaires** (`apps/web/src/lib/dictionaries.ts`) :
   - Chaque clé de texte est définie en FR et AR
   - Utilisation : `dict.nav.services` → "Services" (FR) ou "الخدمات" (AR)

3. **RTL support** :
   - Le layout injecte `<html lang="ar" dir="rtl">` pour les pages arabes
   - Les composants utilisent les propriétés logiques CSS (`start`/`end` au lieu de `left`/`right`)
   - Police arabe : Noto Sans Arabic via Google Fonts

### Ajouter une nouvelle chaîne de traduction

```typescript
// apps/web/src/lib/dictionaries.ts
// 1. Ajouter le type dans Dictionary
type Dictionary = {
  mySection: {
    myKey: string;
  };
};

// 2. Ajouter les valeurs FR et AR
const dictionaries = {
  fr: {
    mySection: { myKey: 'Ma valeur' },
  },
  ar: {
    mySection: { myKey: 'قيمتي' },
  },
};

// 3. Utiliser dans un composant
const dict = getDictionary(locale);
<h1>{dict.mySection.myKey}</h1>
```

## Pages du site public

| Route                  | FR                | AR                |
|---------------------------|-------------------|-------------------|
| `/[locale]`              | Page d'accueil    | الصفحة الرئيسية  |
| `/[locale]/le-port`      | Le Port           | الميناء           |
| `/[locale]/infrastructures` | Infrastructures | البنية التحتية    |
| `/[locale]/services`     | Services          | الخدمات           |
| `/[locale]/procedures`   | Procédures        | الإجراءات         |
| `/[locale]/tarifs`       | Tarifs            | التعريفات         |
| `/[locale]/escales`      | Escales           | الرسو             |
| `/[locale]/appels-offres`| Appels d'Offres   | المناقصات         |
| `/[locale]/documentation`| Documentation     | الوثائق           |
| `/[locale]/medias`       | Médias            | الإعلام           |
| `/[locale]/contact`      | Contact           | اتصل بنا          |
| `/[locale]/search`       | Recherche         | البحث             |

## Sections Admin

| Route        | Section                  |
|--------------|--------------------------|
| `/`          | Tableau de bord          |
| `/login`     | Page de connexion (mock) |
| `/contents`  | Gestion des contenus     |
| `/documents` | Documents GED            |
| `/services`  | Services portuaires      |
| `/requests`  | Demandes & requêtes      |
| `/tenders`   | Appels d'offres          |
| `/medias`    | Médiathèque              |
| `/users`     | Utilisateurs & rôles     |
| `/analytics` | Analytique               |
| `/settings`  | Paramètres               |

**Connexion mock** : `admin@pan.mr` / `admin`

## Scripts

| Commande         | Description                     |
|------------------|---------------------------------|
| `pnpm dev`       | Lance web + admin en parallèle  |
| `pnpm dev:web`   | Lance le site public uniquement |
| `pnpm dev:admin` | Lance le back-office uniquement |
| `pnpm build`     | Build de production             |
| `pnpm lint`      | Linter sur tous les packages    |
| `pnpm clean`     | Supprime .next et node_modules  |

## Phases de développement

### Phase 1 — ✅ Bootstrap
- Monorepo pnpm workspaces
- Next.js App Router + TypeScript + Tailwind v4
- Package partagé (@pan/shared) : types, utils, mock data

### Phase 2 — ✅ UI System + Layout + i18n
- Header avec navigation, recherche, switch de langue
- Footer avec liens légaux et contacts
- 12 pages publiques avec routage localisé
- Support RTL complet pour l'arabe
- Admin : login, dashboard, 9 sections
- Dictionnaires FR/AR complets

### Phase 3 — ✅ Module de Contenu Dynamique (CMS)
- Types de contenus : actualités, communiqués, événements, alertes.
- Pages listes avec filtrage (FR/AR)
- Interface de gestion (CRUD) mock dans l'Admin.

### Phase 4 — ✅ Module GED (Gestion Électronique des Documents)
- Bibliothèque de documents filtrables.
- Métadonnées riches (thème, direction, type de fichier).
- Accès public vs restreint/interne.
- Gestion CRUD des documents et des versions dans l'Admin.

### Phase 5 — ✅ Services et Requêtes
- Catalogue des services portuaires.
- Formulaires publics de requêtes (Réclamations, Info, Documents).
- Gestionnaire de requêtes admin avec assignations et statuts.

### Phase 6 — ✅ Sécurité et RBAC (Dernière phase réalisée)
- Implémentation du contrôle d'accès basé sur les rôles (RBAC).
- Matrice de permission par module (`contents`, `documents`, `requests`, `services`, etc.)
- Journalisation des audits (Actions des utilisateurs, Connexions échouées).
- Limites de taux (Rate Limiting) sur les connexions et soumissions de formulaires.
- Hardening des uploads (validation stricte des fichiers).

### Phase 7 — ✅ SEO, Performance, Analytics & Légal
- Configuration SEO : `sitemap.xml`, `robots.txt`, Global Metadata et `generateMetadata` dymaniques.
- SEO Techniques : Structured Data JSON-LD (`Organization`, `Service`).
- Performance : Headers de cache & sécurité dans `next.config.ts`, optimisation native via Next.js.
- Analytics : Intégration unifiée Google Analytics (`gtag`) & Matomo. 
- Pages Légales : Mentions Légales et Politique de Confidentialité bilingues.
- Bannière de Cookies : Consentement de l'utilisateur avec prise en charge de localStorage.

### Phase 8 — ✅ Préparation Production & Opérations
- Exemples de configuration d'environnements : `.env.development.example` et `.env.production.example`.
- Stratégie de stockage des Documents (GED) clarifiée pour évoluer vers de l'Object Storage (S3).
- Guides d'opérations et documentation complète :
  - **[Guide Administrateur](./docs/admin-guide.md)**
  - **[Guide Rédacteur / GED](./docs/editor-guide.md)**
  - **[Guide Déploiement et Logs](./docs/deployment.md)**
  - **[Runbook Sauvegardes / Restaurations](./docs/backup-restore.md)**
- Scripts Shell fournis (`/scripts/backup.sh` & `/scripts/restore.sh`).

### Phase 9 — ✅ Démo / Client Preview Build (Phase Finale)
- Rendu bilingue (FR/AR) optimisé avec une mock data de qualité institutionnelle.
- Commande `pnpm preview` pour simuler le build de production pour les deux sites simultanément.
- Scénario de Présentation (Demo) client ajouté au système documentaire.
  - **[🔗 Voir le script de démo (À lire avant présentation)](./docs/demo.md)**

## 📚 Documentation & Exploitation

> L'ensemble du système est documenté dans le dossier `/docs` pour l'IT du PAN ou un prestataire.

- **Fichiers d'Environnement** : Ne committez jamais vos `.env` finaux.
- **Stockage GED** : Les PDF volumineux sont mis dans `storage/uploads/` (Fallback). S3 recommandation forte.
- **Sauvegardes (Scripts)** : Les scripts sont fournis dans `/scripts/`. Lancez `bash scripts/backup.sh` en respectant la configuration Cron. Retrouvez comment restaurer avec `restore.sh` dans le Runbook dédié.
- **Démonstration Client** : Suivez les étapes de `docs/demo.md` pour un aperçu complet des capacités.

## 🔒 Checklist de Sécurité (Phase 6)
- [x] **RBAC appliqué** : Matrice `ROLE_PERMISSIONS` utilisée via le composant `RequirePermission`.
- [x] **Routes protégées** : Toutes les sections Admin sont fermées au rôle `internal_reader` sauf autorisation explicite.
- [x] **Limites de taux de connexion (Rate Limiting)** : 5 max tentatives en 5 minutes.
- [x] **Verrouillage des comptes** : Alertes pour mots de passe invalides ou comptes verrouillés temporairement.
- [x] **Journal d'audit** : Dashboard `/audit` traquant tout le cycle de vie métier et de connexion.
- [x] **2FA** : Recommandations et état 2FA affichés dans l'onglet des utilisateurs Admin.
- [x] **Sécurité des Fichiers** : Filtrage strict par taille (Max 10Mo), extension (`.pdf`, `.xlsx`...) et interdiction de fichiers potentiellement malveillants (`.exe`, `.sh`, `.php`...).

---

© 2025 Port Autonome de Nouadhibou
