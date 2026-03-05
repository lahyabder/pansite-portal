# Demo Script : Prototype du Port Autonome de Nouadhibou

Ce document vous guide pas-à-pas pour présenter le produit (Site Public et Back-Office) aux parties prenantes du client.

## 🏁 Démarrage du projet

Exécutez cette commande unique pour lancer la preview de production (construit le site et démarre les serveurs locaux) :

```bash
pnpm preview
```

Cela démarrera automatiquement :
- Le site public sur : http://localhost:3000
- L'administration sur : http://localhost:3001

## 🎬 Déroulé de la Démo

### Partie 1 : Le Site Public (L'Expérience Citoyen/Client)

Ouvrez [http://localhost:3000](http://localhost:3000).

1. **Design et Bilinguisme (RTL/LTR)**
   - Montrez la page d'accueil avec son design institutionnel, la barre d'alerte urgente et les actualités.
   - Cliquez sur le bouton de langue en haut à gauche (Français / العربية).
   - *Effet Waouh* : L'interface entière bascule instantanément de gauche à droite (RTL), y compris les menus et la typographie optimisée (`Noto Sans Arabic`).

2. **La GED Publique (Documentation)**
   - Allez sur l'onglet **Documentation**.
   - Montrez le système de filtre (Thème, Entité) et le module de recherche.
   - Les documents "Publics" peuvent être téléchargés. Expliquez que les documents marqués "Interne" redirigent vers l'authentification (ce qui protège le patrimoine interne du PAN).

3. **Le Catalogue de Services (Démarches)**
   - Allez dans **Services / Manutention** ou **Stockage**.
   - Montrez la structure riche : description détaillée, étapes claires, coût, bénéficiaires et contacts directs.
   - Simulez une action : en bas de la page ou dans la section "Contact", remplissez un formulaire de requête (ex: Demande d'information) et envoyez-le. Une alerte confirmant l'envoi s'affichera.

4. **Pages Institutionnelles et Légales**
   - Descendez au Footer (Pied de page).
   - Montrez les pages Mentions Légales et Politique de Confidentialité.
   - Appuyez sur "Accepter" sur le Cookie Banner pour montrer le respect de la vie privée (RGPD/Lois locales).

### Partie 2 : Le Back-Office (L'Expérience Employé)

Basculer sur le navigateur vers [http://localhost:3001](http://localhost:3001).

1. **Sécurité et Contrôle d'accès (RBAC)**
   - Tapez des informations bidons, montrez le message d'erreur et expliquez que le "Rate Limiting" bloque l'utilisateur après 5 tentatives (protège contre le piratage).
   - Connectez-vous avec le compte **Super Administrateur** :
     - Identifiant : `admin@pan.mr`
     - Mot de Passe : `admin`

2. **Le Dashboard (Tableau de Bord)**
   - Montrez les métriques claires : nombres de requêtes, contenus publiés, derniers documents. L'interface est épurée, moderne et réactive.

3. **Traitement d'une Requête (Module Services)**
   - Allez dans la section **Requêtes**.
   - Vous y verrez le formulaire qui a été soumis lors de la "Partie 1".
   - Ouvrez la requête, changez son statut ("En cours" ou "Fermé"). Le système enregistre instantanément qui a fait le changement (Audit).

4. **Création d'une Actualité (Workflow CMS)**
   - Allez dans **Contenus**.
   - Créez un nouvel article (titre en français et en arabe). L'interface exige les deux langues.
   - Mettez l'article en mode `"Publié"`.
   - Retournez sur le site public pour montrer que l'article est apparu instantanément.

5. **Gestion Électronique des Documents (Module GED)**
   - Allez dans **Documents GED**.
   - Expliquez la notion de Metadata : Choix de la direction, du thème et du niveau d'accès (Public, Restreint, Interne).
   - Montrez l'option de **Gestion des Versions** qui assure de toujours avoir les PDF historiques sans jamais rien supprimer.

6. **Journal d'Audit (Track-record de Haute Sécurité)**
   - Allez dans **Audit**.
   - Montrez que chacune des actions réalisées depuis 10 minutes (connexion réussie, création de contenu, changement de statut) est loguée avec précision (Heure, IP simulée, ID de l'utilisateur).
   - Répétez que le site PAN répond aux plus hautes normes de traçabilité gouvernementale.

## 🏁 Conclusion

Rappelez au client que ce livrable (Phase 1 à 9) constitue la base solide du projet :
- Architecture Modulaire extensible
- Prêt pour la Production (Sécurité, Cache, SEO)
- Base UI/UX finalisée
- Intégrable prochainement avec des bases Postgres, Auth v2 et ERP.
