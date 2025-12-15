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

## ⚙️ Configuration

### Variables d'environnement

Le service Mailer supporte trois modes de configuration :

#### Mode 1 : Ethereal (par défaut - pour les tests)
Aucune configuration requise. Le service utilise automatiquement Ethereal Email pour créer des comptes de test temporaires.

```env
# Optionnel : spécifier explicitement le mode
MAIL_MODE=ethereal
MAIL_FROM=app@localhost.com
```

**Avantages** :
- Aucune configuration nécessaire
- Parfait pour le développement et les tests
- Les emails sont visibles sur https://ethereal.email

#### Mode 2 : SMTP réel (production)
Configuration avec un serveur SMTP réel (Gmail, SendGrid, etc.)

```env
MAIL_MODE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
MAIL_FROM=votre-email@gmail.com
```

**Exemples de configuration** :
- **Gmail** : `smtp.gmail.com:587` (nécessite un mot de passe d'application)
- **SendGrid** : `smtp.sendgrid.net:587`
- **Outlook** : `smtp-mail.outlook.com:587`

#### Mode 3 : MailHog local (développement)
Pour utiliser MailHog local (nécessite que MailHog soit démarré)

```env
MAIL_MODE=mailhog
# MailHog utilise localhost:1025 par défaut
```

**Pour démarrer MailHog** :
```bash
# Avec Docker
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Ou télécharger depuis https://github.com/mailhog/MailHog
```

### Exemple de fichier .env

```env
# Mode Ethereal (développement/test)
MAIL_MODE=ethereal
MAIL_FROM=app@localhost.com

# OU Mode SMTP réel (production)
# MAIL_MODE=smtp
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# MAIL_FROM=your-email@gmail.com
```

## 🔍 Dépannage

### Erreur : `ECONNREFUSED ::1:1025`
Cette erreur signifie que le service essaie de se connecter à MailHog mais que le serveur n'est pas démarré.

**Solutions** :
1. **Utiliser le mode Ethereal** (recommandé pour le développement) :
   ```env
   MAIL_MODE=ethereal
   ```

2. **Démarrer MailHog** si vous voulez utiliser MailHog :
   ```bash
   docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```

3. **Configurer un SMTP réel** pour la production

### Voir les emails en mode Ethereal
En mode Ethereal, l'URL de prévisualisation est affichée dans les logs :
```
Email de test envoyé. Prévisualisation: https://ethereal.email/message/...
```

## 🔗 Liens

- [Documentation Nodemailer](https://nodemailer.com/)
- [Ethereal Email](https://ethereal.email/)
- [MailHog](https://github.com/mailhog/MailHog)

