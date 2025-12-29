import { IOrderRepository } from '../repositories/IOrderRepository';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { NotificationService } from './NotificationService';
import { ProductFactory } from '../domain/ProductFactory';
import logger from '../lib/logger';

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private notificationService: NotificationService
  ) {}

  async execute(data: { customer: string, items: any[], paymentMethod: IPaymentMethod, paymentDetails: any }) {
    const { customer, items, paymentMethod, paymentDetails } = data;

    //  VALIDAÇÃO
    if (!items || items.length === 0) {
      logger.error('Tentativa de pedido sem itens');
      throw new Error('Carrinho vazio');
    }

    //  CÁLCULO DE PREÇO E ESTOQUE
    let totalAmount = 0;
    let productsDetails = [];

    for (const item of items) {
      const productData = await this.orderRepository.findProductById(item.productId);
      
      if (!productData) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }

      const product = ProductFactory.createProduct(productData);
      
      totalAmount += product.price * item.quantity;
      totalAmount += product.calculateFreight();

      productsDetails.push({ ...productData, quantity: item.quantity });
    }

    //  PROCESSAMENTO DE PAGAMENTO
    await paymentMethod.process(totalAmount, paymentDetails);

    //  PERSISTÊNCIA
    const order = await this.orderRepository.save({
      customer,
      items: JSON.stringify(productsDetails),
      total: totalAmount,
      status: 'confirmed'
    });

    //  NOTIFICAÇÃO
    const notificationInfo = await this.notificationService.sendOrderConfirmation(customer, order, productsDetails);

    return {
      order,
      notificationInfo
    };
  }
}
