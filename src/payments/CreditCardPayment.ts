import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class CreditCardPayment implements IPaymentMethod {
  async process(amount: number, details: any): Promise<void> {
    logger.info(`Processando cartão final ${details.cardNumber.slice(-4)} no valor de R$ ${amount}`);
    if (details.cvv === '000') throw new Error('Cartão recusado');
  }
}
