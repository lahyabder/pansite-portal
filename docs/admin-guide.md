# Guide Administrateur Système (Admin Guide)

Bienvenue dans le guide administrateur système (Rôle `super_admin`) du **Port Autonome de Nouadhibou**.

Ce rôle donne accès **complet** au back-office, y compris à la gestion des rôles, la sécurité, l'audit, et les paramètres du site.

## 1. Gestion des Utilisateurs et Rôles (RBAC)

Accès : **Menu > 👥 Utilisateurs**

Dans cet écran, vous créez et désactivez les comptes des employés du PAN.
Chaque utilisateur doit être assigné à un **Rôle**, qui détermine strictement ce à quoi il a accès via la grille RBAC globale.

Les rôles disponibles :
- **Super Admin** : Accès total. Peut modifier les autres rôles.
- **Content Admin** : Limité à "Actualités", "Événements", "Alertes".
- **GED Manager** : Accès exclusif à la gestion électronique des documents de l'entreprise.
- **Services Manager** : Gère le catalogue des services et traite les requêtes/plaintes envoyées par le public.
- **Validator** : Rôle d'approbation. Voit les brouillons et peut publier.
- **Internal Reader** : Ne possède aucun pouvoir de modification globale, mais peut visualiser des documents classifiés « internes ».

## 2. Le Journal d'Audit

Accès : **Menu > 📜 Journal d'Audit**

La plateforme stocke toutes les actions significatives dans le journal d'activité :
- **Authentification** : Connexions réussies (`login`), échouées (`failed_login`) ou accès refusé (`permission_denied`).
- **Création/Modification** : Lorsqu'un utilisateur crée un contenu ou manipule un compte.

> Note de sécurité: Vous pouvez utiliser le système de filtres de la page Audit (par date, type d'action ou module) pour enquêter en cas de compromission d'un compte. Les connexions échouées successives (Rate limit de 5) sont inscrites au journal avant que le compte ne soit verrouillé.

## 3. Paramètres & Paramétrages (Settings)

Accès : **Menu > ⚙️ Paramètres**

Ce module permet de modifier :
- Le nom d'affichage global et la configuration SSO (Futur).
- L'état de maintenance du site (Basculer la bannière publique globale urgence maintenance).
- Intégrer les webhooks si une liaison avec l'ERP Interne du PAN est déployée.

## 4. Sécurité globale

Assurez-vous que vos Super Admins (utilisateurs niveau Root) activent le **2FA (Authentification à Deux Facteurs)**. La force de mot de passe est vérifiée par les politiques back-end lors de la création d'utilisateurs. Ne recyclez jamais de mots de passe test.
