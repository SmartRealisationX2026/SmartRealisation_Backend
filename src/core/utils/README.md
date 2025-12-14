# 🛠️ Utils - Utilitaires Partagés

## 📋 Vue d'ensemble

Le répertoire `utils/` contient des **fonctions utilitaires** partagées utilisables dans toute l'application.

## 🎯 Principe

Les utilitaires sont des **fonctions pures** :
- **Indépendantes** : Pas de dépendances vers d'autres couches
- **Réutilisables** : Utilisables dans différents contextes
- **Testables** : Faciles à tester unitairement

## 📁 Utilitaires disponibles

### `sanitizeFileName.ts`

Fonction pour nettoyer et sécuriser les noms de fichiers.

**Utilisation** :
```typescript
import { sanitizeFileName } from 'src/core/utils/sanitizeFileName';

const cleanName = sanitizeFileName('mon fichier@123.txt');
// Retourne un nom de fichier sécurisé
```

**Fonctionnalités** :
- Supprime les caractères spéciaux dangereux
- Normalise les espaces
- Préserve l'extension du fichier

## ✅ Bonnes pratiques

### ✅ À faire
- Créer des fonctions pures (sans effets de bord)
- Documenter avec JSDoc
- Ajouter des tests unitaires
- Exporter via `index.ts` si nécessaire

### ❌ À éviter
- Ajouter des dépendances vers d'autres couches
- Créer des fonctions avec effets de bord
- Mélanger la logique métier avec les utilitaires
- Oublier de tester les utilitaires

## 📝 Ajouter un nouvel utilitaire

1. Créer le fichier dans `utils/`
2. Exporter la fonction
3. Ajouter des tests
4. Documenter avec JSDoc

**Exemple** :
```typescript
// utils/formatDate.ts
/**
 * Formate une date au format français
 * @param date - Date à formater
 * @returns Date formatée (JJ/MM/AAAA)
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR');
}
```

