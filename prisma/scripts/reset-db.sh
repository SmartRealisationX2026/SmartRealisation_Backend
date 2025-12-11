#!/bin/bash

# Script de réinitialisation complète de la base de données MediLink
# ATTENTION: Supprime toutes les données!
# Utilisation: bash prisma/scripts/reset-db.sh

set -e  # Arrêt sur erreur

echo "⚠️  ATTENTION: Cette commande va supprimer TOUTES les données!"
read -p "Êtes-vous sûr de vouloir continuer? (tapez 'yes' pour confirmer): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Opération annulée"
    exit 1
fi

echo "🔄 Réinitialisation complète de la base de données..."

echo "🗑️  Suppression de la base medilink_db..."
dropdb medilink_db --if-exists

echo "📦 Recréation de la base medilink_db..."
createdb medilink_db

echo "👤 Création de l'utilisateur medilink_user..."
psql -c "CREATE USER medilink_user WITH PASSWORD 'medilink123';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE medilink_db TO medilink_user;"

echo "🗃️  Application des migrations Prisma..."
npx prisma migrate dev --name init

echo "🌱 Exécution des seeds..."
npx prisma db seed

echo "✅ Base de données réinitialisée avec succès!"
echo ""
echo "🎯 La base contient maintenant:"
echo "- Toutes les tables créées"
echo "- Données de test (users, pharmacies, medications, stocks)"
echo "- Contraintes et index appliqués"
