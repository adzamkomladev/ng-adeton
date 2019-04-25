import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { AuthService } from './auth.service';
import { ShoppingCartService } from './shopping-cart.service';
import { Order } from './order';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  ordersCollection: AngularFirestoreCollection<Order>;
  order: Order;

  constructor(
    private auth: AuthService,
    private shoppingCartService: ShoppingCartService,
    private afs: AngularFirestore
  ) {
    this.ordersCollection = this.afs.collection<Order>('orders');

    this.getOrCreateOrder().then(res => (this.order = res));
  }

  async getUserOrders() {
    const userId = await this.auth.user$
      .pipe(
        first(),
        map(user => user.uid)
      )
      .toPromise();

    const orders = await this.afs
      .collection<Order>('orders', ref =>
        ref.where('userId', '==', userId).where('status', '==', 'Completed')
      )
      .snapshotChanges()
      .pipe(
        first(),
        map(docs =>
          docs.map(doc => {
            const data = doc.payload.doc.data();
            data.id = doc.payload.doc.id;
            return data;
          })
        )
      )
      .toPromise();

    return orders;
  }

  private async getOrCreateOrder() {
    const userId = await this.auth.user$
      .pipe(
        first(),
        map(user => user.uid)
      )
      .toPromise();

    const cartID = localStorage.getItem('cartID');
    const orderId = localStorage.getItem('orderId');

    if (!!orderId) {
      return this.ordersCollection
        .doc<Order>(orderId)
        .valueChanges()
        .pipe(
          first(),
          map(res => {
            const data = res;
            data.id = orderId;
            return data;
          })
        )
        .toPromise();
    } else {
      const orderDoc = await this.ordersCollection.add({
        userId: userId,
        shoppingCartId: cartID
      });

      localStorage.setItem('orderId', orderDoc.id);

      return this.ordersCollection
        .doc<Order>(orderDoc.id)
        .valueChanges()
        .pipe(
          first(),
          map(res => {
            const data = res;
            data.id = orderDoc.id;
            return data;
          })
        )
        .toPromise();
    }
  }

  async add(order: Order) {
    this.ordersCollection
      .doc<Order>(order.id)
      .set(order)
      .then(() => {
        console.log('Order updated successfully');

        localStorage.removeItem('cartID');
        localStorage.removeItem('orderId');
        this.shoppingCartService.reInitialize().then(() => console.log('done'));
      })
      .catch(err => console.log('Order failed to save ', err));
  }

  getOrder(): Order {
    return this.order;
  }
}
