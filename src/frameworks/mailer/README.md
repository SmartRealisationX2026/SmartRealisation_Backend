# 📧 Mailer - Service d'envoi d'emails

## 📋 Vue d'ensemble

Le service Mailer permet d'envoyer des emails depuis l'application.

## 🎯 Principe

Le service Mailer encapsule la logique d'envoi d'emails et peut être utilisé dans toute l'application.

## 📁 Fichiers

- `mailer.module.ts` - Module NestJS qui exporte MailerService
- `mailer.service.ts` - Service d'envoi d'emails

## 🔄 Utilisation

### Injection dans les Services

```typescript
// use-cases/auth/auth.service.ts
import { MailerService } from 'src/frameworks/mailer/mailer.service';

@Injectable()
export class AuthCaseService {
  constructor(private mailer: MailerService) {}

  async sendWelcomeEmail(user: User) {
    await this.mailer.sendEmail(
      user.email,
      'Bienvenue sur MediLink',
      `Bonjour ${user.fullName}, bienvenue !`
    );
  }
}
```

## ✅ Bonnes pratiques

### ✅ À faire
- Utiliser le service Mailer pour tous les envois d'emails
- Gérer les erreurs d'envoi
- Utiliser des templates pour les emails
- Logger les envois d'emails

### ❌ À éviter
- Envoyer des emails directement depuis les controllers
- Oublier de gérer les erreurs
- Exposer les credentials SMTP
- Envoyer des emails en synchrone

## 🔗 Liens

- Configuration SMTP dans les variables d'environnement

