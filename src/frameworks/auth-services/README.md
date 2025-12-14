# 🔐 Auth Services - JWT Authentication

## 📋 Vue d'ensemble

Les services d'authentification gèrent l'authentification JWT et la protection des routes.

## 🎯 Principe

L'authentification utilise **JWT (JSON Web Tokens)** avec Passport.js :
- **Strategy** : Valide les tokens JWT
- **Guard** : Protège les routes nécessitant une authentification

## 📁 Fichiers

- `JwtAuthStrategy.ts` - Stratégie Passport pour valider les tokens JWT
- `JwtAuthGuard.ts` - Guard NestJS pour protéger les routes

## 🔄 Utilisation

### Protection des routes

```typescript
// controllers/user/user.controller.ts
import { JwtAuthGuard } from 'src/frameworks/auth-services/JwtAuthGuard';

@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  // Toutes les routes sont protégées
}
```

### Protection d'une route spécifique

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req) {
  // req.user contient les données du token décodé
  return req.user;
}
```

## 🔑 Configuration JWT

La configuration JWT se fait dans `app.module.ts` :

```typescript
JwtModule.register({
  global: true,
  secret: process.env.JWT_SECRET || 'your-secret-key',
  signOptions: { expiresIn: '2h' },
})
```

## ✅ Bonnes pratiques

### ✅ À faire
- Utiliser les Guards pour protéger les routes
- Stocker le secret JWT dans les variables d'environnement
- Valider les tokens à chaque requête
- Utiliser des tokens avec expiration

### ❌ À éviter
- Exposer le secret JWT dans le code
- Utiliser des tokens sans expiration
- Oublier de protéger les routes sensibles
- Stocker des données sensibles dans le token

## 🔗 Liens

- [Passport.js](http://www.passportjs.org/) - Documentation Passport
- [JWT](https://jwt.io/) - Documentation JWT

