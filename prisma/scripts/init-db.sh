#!/bin/bash

# Script d'initialisation de la base de données MediLink
# Utilisation: bash prisma/scripts/init-db.sh

set -e  # Arrêt sur erreur

echo "🔧 Initialisation de la base de données MediLink..."

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé ou n'est pas dans le PATH"
    echo "💡 Installez PostgreSQL et assurez-vous que psql est accessible"
    exit 1
fi

# Vérifier si la connexion fonctionne
if ! psql -c "SELECT version();" &> /dev/null; then
    echo "❌ Impossible de se connecter à PostgreSQL"
    echo "💡 Vérifiez que PostgreSQL est démarré et que vos credentials sont corrects"
    exit 1
fi

echo "📦 Création de la base de données medilink_db..."
createdb medilink_db 2>/dev/null || echo "⚠️  La base medilink_db existe déjà"

echo "👤 Création de l'utilisateur medilink_user..."
psql -c "CREATE USER medilink_user WITH PASSWORD 'medilink123';" 2>/dev/null || echo "⚠️  L'utilisateur medilink_user existe déjà"

echo "🔑 Attribution des droits..."
psql -c "GRANT ALL PRIVILEGES ON DATABASE medilink_db TO medilink_user;"

echo "✅ Base de données initialisée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Copiez .env.example vers .env et ajustez les credentials"
echo "2. Lancez: npx prisma migrate dev"
echo "3. Lancez: npx prisma db seed"
