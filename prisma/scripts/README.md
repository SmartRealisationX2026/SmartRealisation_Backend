# 📜 Scripts Prisma - Scripts de Base de Données

## 📋 Vue d'ensemble

Le répertoire `scripts/` contient des scripts utilitaires pour la gestion de la base de données PostgreSQL.

## 📁 Scripts disponibles

### 1. **init-db.sh**

Script d'initialisation de la base de données.

**Fonctionnalités** :
- Crée la base de données `medilink_db`
- Crée l'utilisateur `medilink_user`
- Configure les permissions

**Utilisation** :
```bash
bash prisma/scripts/init-db.sh
```

### 2. **reset-db.sh**

Script de réinitialisation complète de la base de données.

**⚠️ ATTENTION** : Ce script **supprime toutes les données** !

**Fonctionnalités** :
- Supprime la base de données
- Recrée la base de données
- Réapplique les migrations
- Réexécute les seeds

**Utilisation** :
```bash
bash prisma/scripts/reset-db.sh
```

### 3. **validate.sql**

Script SQL de validation de la structure de la base de données.

**Fonctionnalités** :
- Vérifie l'existence des tables
- Vérifie les contraintes
- Vérifie les index
- Affiche un rapport de validation

**Utilisation** :
```bash
psql -d medilink_db -f prisma/scripts/validate.sql
```

## 🔄 Workflow recommandé

### Première installation
```bash
# 1. Initialiser la base
bash prisma/scripts/init-db.sh

# 2. Générer le client Prisma
npm run db:generate

# 3. Appliquer les migrations
npm run db:migrate

# 4. Peupler avec des données de test
npm run db:seed
```

### Réinitialisation complète
```bash
# ⚠️ Supprime toutes les données
bash prisma/scripts/reset-db.sh
```

### Validation
```bash
# Vérifier la structure
psql -d medilink_db -f prisma/scripts/validate.sql
```

## ✅ Bonnes pratiques

### ✅ À faire
- Utiliser `init-db.sh` pour la première installation
- Valider la structure après les migrations
- Sauvegarder avant d'utiliser `reset-db.sh`

### ❌ À éviter
- Utiliser `reset-db.sh` en production
- Modifier les scripts sans comprendre leur impact
- Exécuter les scripts sans vérifier les permissions

## 🔗 Liens

- [Prisma README](../README-db.md) - Documentation complète de la base de données

