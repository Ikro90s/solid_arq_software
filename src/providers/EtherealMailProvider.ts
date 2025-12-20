import nodemailer from 'nodemailer';
import { IMailProvider } from './IMailProvider';
import { getMailClient } from '../lib/mail';
import logger from '../lib/logger';

export class EtherealMailProvider implements IMailProvider {
  async sendMail(to: string, subject: string, body: { text: string, html: string }): Promise<any> {
    const mailer = await getMailClient();

    const info = await mailer.sendMail({
      from: '"DevStore" <noreply@devstore.com>',
      to,
      subject,
      text: body.text,
      html: body.html,
    });

    logger.info(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`);
    return info;
  }
}
