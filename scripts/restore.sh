#!/bin/bash
# ==============================================================================
# Script de restauration - Port Autonome de Nouadhibou (PAN)
# ==============================================================================

set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <DB_BACKUP_FILE.sql.gz> <FILES_BACKUP_FILE.tar.gz>"
    echo "Exemple: $0 /var/backups/pansite/pan_db_20250101.sql.gz /var/backups/pansite/pan_files_20250101.tar.gz"
    exit 1
fi

DB_FILE=$1
FILES_FILE=$2
DB_NAME="pansite_prod"
UPLOADS_DIR="/var/www/pansite/storage/uploads"

echo "[$(date)] Début de la restauration..."

# 1. Restauration de la Base de Données
echo "[$(date)] Restauration de la base de données $DB_NAME depuis $DB_FILE..."
# Décommentez pour activer la restauration pg_dump:
# dropdb -U postgres $DB_NAME || true
# createdb -U postgres $DB_NAME
# zcat "$DB_FILE" | psql -U postgres $DB_NAME
echo " (Mode Simulation - Mock Data : Aucune DB à restaurer)"

# 2. Restauration des fichiers
echo "[$(date)] Restauration des fichiers vers $UPLOADS_DIR depuis $FILES_FILE..."
mkdir -p "$UPLOADS_DIR"
# Nettoyer l'existant avant de restaurer (ATTENTION)
# rm -rf "${UPLOADS_DIR:?}/*"
tar -xzf "$FILES_FILE" -C "$UPLOADS_DIR"

echo "[$(date)] Restauration terminée."
