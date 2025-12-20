import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  private prisma = new PrismaClient();

  async save(order: { customer: string, items: string, total: number, status: string }): Promise<any> {
    return this.prisma.order.create({
      data: order
    });
  }

  async findProductById(id: number): Promise<any> {
    return this.prisma.product.findUnique({
      where: { id }
    });
  }
}
