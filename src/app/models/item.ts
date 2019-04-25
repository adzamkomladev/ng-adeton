import { Product } from './product';

export interface Item {
  id?: string;
  quantity: number;
  product: Product;
}
