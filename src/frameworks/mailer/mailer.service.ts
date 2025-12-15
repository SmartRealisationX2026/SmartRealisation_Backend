import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    const mailMode = this.configService.get<string>('MAIL_MODE', 'ethereal');
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE', false);

    // Mode Ethereal (pour les tests - ne nécessite pas de serveur SMTP)
    if (mailMode === 'ethereal' || (!smtpHost && !smtpPort)) {
      this.logger.log('Utilisation du mode Ethereal pour les tests');
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.logger.log(`Compte Ethereal créé: ${testAccount.user}`);
        return this.transporter;
      } catch (error) {
        this.logger.error('Erreur lors de la création du compte Ethereal', error);
        throw error;
      }
    }

    // Mode SMTP réel
    if (smtpHost && smtpPort) {
      this.logger.log(`Configuration SMTP: ${smtpHost}:${smtpPort}`);
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: smtpUser && smtpPass ? {
          user: smtpUser,
          pass: smtpPass,
        } : undefined,
        tls: {
          rejectUnauthorized: false,
        },
      });
      return this.transporter;
    }

    // Mode MailHog local (fallback)
    this.logger.warn('Utilisation de MailHog local (port 1025) - assurez-vous qu\'il est démarré');
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
    });
    return this.transporter;
  }

  async sendSignupConfirmation(userEmail: string, otp: string): Promise<void> {
    try {
      const transporter = await this.getTransporter();
      const mailMode = this.configService.get<string>('MAIL_MODE', 'ethereal');

      const info = await transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM', 'app@localhost.com'),
        to: userEmail,
        subject: 'Inscription - Code de confirmation',
        html: `<h1>Voici votre code OTP : ${otp}</h1><p>Ce code est valide pendant 10 minutes.</p>`,
      });

      // En mode Ethereal, afficher l'URL de prévisualisation
      if (mailMode === 'ethereal' && nodemailer.getTestMessageUrl) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          this.logger.log(`Email de test envoyé. Prévisualisation: ${previewUrl}`);
        }
      } else {
        this.logger.log(`Email envoyé avec succès à ${userEmail}`);
      }
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email à ${userEmail}`, error);
      
      // En développement, on peut logger l'OTP au lieu de faire échouer
      if (process.env.NODE_ENV !== 'production') {
        this.logger.warn(`En développement: OTP pour ${userEmail} = ${otp}`);
      }
      
      throw error;
    }
  }
}