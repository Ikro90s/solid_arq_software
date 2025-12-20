export interface IMailProvider {
  sendMail(to: string, subject: string, body: { text: string, html: string }): Promise<any>;
}
