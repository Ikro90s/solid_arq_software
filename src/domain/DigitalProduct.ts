import { Product } from './IProduct';

export class DigitalProduct extends Product {
  constructor(
    id: number,
    name: string,
    price: number
  ) {
    super(id, name, price);
  }

  calculateFreight(): number {
    return 0;
  }
}
