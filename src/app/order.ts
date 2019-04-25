import { firestore } from 'firebase';

export interface Order {
  id?: string;
  userId?: string;
  shoppingCartId?: string;
  name?: string;
  address?: string;
  city?: string;
  dateOrdered?: any;
  status?: string;
}
