import { Product } from './IProduct';

export class PhysicalProduct extends Product {
  constructor(
    id: number,
    name: string,
    price: number,
    public weight?: number,
    public dimensions?: string
  ) {
    super(id, name, price);
  }

  calculateFreight(): number {
    // Frete fixo simples como no código original
    return 10;
  }
}
