export interface IOrderRepository {
  save(order: { customer: string, items: string, total: number, status: string }): Promise<any>;
  findProductById(id: number): Promise<any>;
}
