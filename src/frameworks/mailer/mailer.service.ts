import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async transporteur () {
    const testAccount = await nodemailer.createTestAccount()
    const transport = nodemailer.createTransport({
      host : "localhost",
      port : 1025,
      ignoreTLS : true,
      auth : {
        user : testAccount.user,
        pass : testAccount.pass
      }
    })

    return transport

  }

  async sendSignupConfirmation (userEmail : string, otp : string) {
    (await this.transporteur()).sendMail({
      from : "app@localhost.com",
      to : userEmail,
      subject : "Inscription",
      html : `<h1>Voici votre OTP : ${otp}</h1> `
    })
  }

}