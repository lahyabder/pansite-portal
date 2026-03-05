#!/bin/bash
# ==============================================================================
# Script de sauvegarde - Port Autonome de Nouadhibou (PAN)
# ==============================================================================

set -e

# Configuration
BACKUP_DIR="/var/backups/pansite"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="pansite_prod" # À adapter
UPLOADS_DIR="/var/www/pansite/storage/uploads"
MAX_BACKUPS_DAYS=30

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Début de la sauvegarde..."

# 1. Sauvegarde de la Base de Données (Préparation pour Phase Postgres)
DB_BACKUP_FILE="${BACKUP_DIR}/pan_db_${TIMESTAMP}.sql.gz"
echo "[$(date)] Sauvegarde de la base de données vers ${DB_BACKUP_FILE}..."
# Décommentez pour activer pg_dump:
# pg_dump -U postgres $DB_NAME | gzip > "$DB_BACKUP_FILE"
echo " (Mode Simulation - Mock Data : Aucune base relationnelle dumpée pour le moment)"

# 2. Sauvegarde des Fichiers (GED et Uploads)
FILES_BACKUP_FILE="${BACKUP_DIR}/pan_files_${TIMESTAMP}.tar.gz"
echo "[$(date)] Sauvegarde des fichiers vers ${FILES_BACKUP_FILE}..."
if [ -d "$UPLOADS_DIR" ]; then
  tar -czf "$FILES_BACKUP_FILE" -C "$UPLOADS_DIR" .
else
  echo " Dossier d'uploads non trouvé : $UPLOADS_DIR (Ignoré)"
fi

# 3. Nettoyage des vieilles sauvegardes
echo "[$(date)] Suppression des sauvegardes de plus de $MAX_BACKUPS_DAYS jours..."
find "$BACKUP_DIR" -name "pan_*.gz" -type f -mtime +$MAX_BACKUPS_DAYS -exec rm -f {} \;

echo "[$(date)] Sauvegarde terminée avec succès."
