import { IMailProvider } from '../providers/IMailProvider';

export class NotificationService {
  constructor(private mailProvider: IMailProvider) {}

  async sendOrderConfirmation(customerEmail: string, order: any, products: any[]) {
    const subject = `Confirmação do Pedido #${order.id}`;
    const text = `Olá, seu pedido #${order.id} no valor de R$ ${order.total} foi confirmado.`;
    const html = `
      <h1>Pedido Confirmado!</h1>
      <p>Olá, seu pedido <b>#${order.id}</b> foi processado com sucesso.</p>
      <p>Total: <strong>R$ ${order.total}</strong></p>
      <ul>
        ${products.map(p => `<li>${p.name}</li>`).join('')}
      </ul>
    `;

    return this.mailProvider.sendMail(customerEmail, subject, { text, html });
  }
}
