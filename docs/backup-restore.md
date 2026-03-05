# Runbook des Sauvegardes et Restaurations (Backup/Restore)

Procédure de continuité des activités (BCP/DRP) pour le portail PAN.

Dans la section `/scripts/` de ce dépôt (repository) figurent deux scripts bash :
1. `backup.sh` : Compacteur et exportateur.
2. `restore.sh` : Réimporteur et désarchiveur.

## 1. Fréquence et Configuration (Cron)

Le répertoire cible est fixé dans le script (`/var/backups/pansite`).
Vous devez configurer une tâche *Cron* sur le serveur d'exploitation pour automatiser ceci (au minimum une fois par nuit à 03h00).

```bash
# Entrer l'éditeur cron :
crontab -e

# Exemple : Ajouter cette ligne pour un backup tous les jours à 3h du matin
0 3 * * * /chemin/vers/scripts/backup.sh >> /var/log/pansite-backup.log 2>&1
```

## 2. Protocole de Sauvegarde (`backup.sh`)

La sauvegarde s'articule sur 2 piliers :
- **a. Données Métier (Base)** : Export SQL gzippé via `pg_dump`. S'assure que tout le contenu, les utilisateurs et les audits métier soient conservés.
- **b. Données Fichiers (GED)** : Archive Tarball (`tar.gz`) du répertoire d'Upload (qui contient les vrais PDF, PPTX de 10-50+ MB). Optionnel si vous passez sur Amazon S3 / MinIO (car le S3 gèrera ses propres snapshots natifs AWS).

> Le script intègre une routine de ménage (Rotation/Retention policy) qui supprime nativement les archives plus vieilles que X jours (30 jours).

## 3. Plan de Récupération - Restauration (`restore.sh`)

⚠️ **URGENCE : Scénario de coupure ou corruption**

Si la machine virtuelle crashe :
1. Déployez votre machine hôte via un conteneur/VM sain puis re-clonez le code Next.js (Cf. [Deployment Guide](./deployment.md)). 
2. Retrouvez vos fichiers de sauvegarde les plus récents stockés hors-site.
3. Transférez-les sur le serveur.
4. Lancez le script en passant les fichiers en paramètre exact :

```bash
chmod +x scripts/restore.sh

./scripts/restore.sh \
  /mnt/sauvegardes_nas/pan_db_20251101_0300.sql.gz \
  /mnt/sauvegardes_nas/pan_files_20251101_0300.tar.gz
```

Le script droppera (détruira) la base existante pour faire refluer le code SQL de récupération et dézippera directement vos medias et certificats dans la route correspondante (`/storage/uploads/`).
Re-démarrez le processus Next.js/PM2 après la fin de the restauration.
