import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class DebitCardPayment implements IPaymentMethod {
  async process(amount: number, details: any): Promise<void> {
    logger.info(`Processando débito no valor de R$ ${amount}`);
  }
}
