import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { DebitCardPayment } from '../payments/DebitCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import nodemailer from 'nodemailer';
import logger from '../lib/logger';

export class OrderController {
  constructor(private orderService: OrderService) {
    this.processOrder = this.processOrder.bind(this);
  }

  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      let paymentStrategy: IPaymentMethod;

      switch (paymentMethod) {
        case 'credit_card':
          paymentStrategy = new CreditCardPayment();
          break;
        case 'debit_card':
          paymentStrategy = new DebitCardPayment();
          break;
        case 'pix':
          paymentStrategy = new PixPayment();
          break;
        default:
          return res.status(400).json({ error: 'Método de pagamento não suportado' });
      }

      const result = await this.orderService.execute({
        customer,
        items,
        paymentMethod: paymentStrategy,
        paymentDetails
      });

      return res.json({ 
        message: 'Pedido processado com sucesso', 
        orderId: result.order.id,
        emailPreview: nodemailer.getTestMessageUrl(result.notificationInfo)
      });

    } catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: error.message || 'Erro interno' });
    }
  }
}