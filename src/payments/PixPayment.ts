import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod {
  async process(amount: number, details: any): Promise<void> {
    logger.info(`Processando Pix no valor de R$ ${amount}`);
  }
}
