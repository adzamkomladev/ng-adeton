import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { ShoppingCart } from './models/shopping-cart';
import { Product } from './models/product';
import { Item } from './models/item';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private shoppingCartCollection: AngularFirestoreCollection<ShoppingCart>;
  private shoppingCart: ShoppingCart = { items: [] };

  constructor(private afs: AngularFirestore) {
    this.shoppingCartCollection = this.afs.collection<ShoppingCart>(
      'shoppingCarts'
    );

    this.getOrCreateShoppingCart().then(res => (this.shoppingCart = res));
  }

  async reInitialize() {
    this.shoppingCart = await this.getOrCreateShoppingCart();
  }

  private getIDFromLocalStorage(): string {
    return localStorage.getItem('cartID');
  }

  get(id: string): Promise<ShoppingCart> {
    return this.shoppingCartCollection
      .doc<ShoppingCart>(id)
      .snapshotChanges()
      .pipe(
        first(),
        map(res => {
          const data = res.payload.data();
          data.id = res.payload.id;
          return data;
        })
      )
      .toPromise();
  }

  async getOrCreateShoppingCart(): Promise<ShoppingCart> {
    const shoppingCartID = this.getIDFromLocalStorage();

    if (!!shoppingCartID) {
      return this.shoppingCartCollection
        .doc<ShoppingCart>(shoppingCartID)
        .valueChanges()
        .pipe(
          first(),
          map(shoppingCart => {
            const data = shoppingCart;
            data.id = shoppingCartID;
            return data;
          })
        )
        .toPromise();
    }

    const shoppingCartDoc = await this.shoppingCartCollection.add({
      dateCreated: new Date().getTime(),
      items: [] as Item[]
    });

    localStorage.setItem('cartID', shoppingCartDoc.id);

    return this.shoppingCartCollection
      .doc<ShoppingCart>(shoppingCartDoc.id)
      .valueChanges()
      .pipe(
        first(),
        map(shoppingCart => {
          const data = shoppingCart;
          data.id = shoppingCartDoc.id;
          return data;
        })
      )
      .toPromise();
  }

  async addProductToShoppingCart(product: Product): Promise<void> {
    const matchingItem = this.shoppingCart.items.filter(
      item => item.product.id === product.id
    )[0];

    if (!!matchingItem) {
      const index = this.shoppingCart.items.indexOf(matchingItem);

      this.shoppingCart.items[index].quantity++;
    } else {
      const newItem: Item = { product: product, quantity: 1 };

      this.shoppingCart.items.push(newItem);
    }

    let shoppingCart = await this.getOrCreateShoppingCart();

    shoppingCart = this.shoppingCart;

    return this.shoppingCartCollection
      .doc(shoppingCart.id)
      .set(shoppingCart)
      .then(() =>
        console.log('Product updated or added in shopping cart successfully')
      )
      .catch(error =>
        console.error(
          'Error updating or adding product in shopping cart',
          error
        )
      );
  }

  async removeProductFromShoppingCart(product: Product): Promise<void> {
    const matchingItem = this.shoppingCart.items.filter(
      item => item.product.id === product.id
    )[0];

    if (!!matchingItem) {
      const index = this.shoppingCart.items.indexOf(matchingItem);

      if (this.shoppingCart.items[index].quantity === 0) {
        this.shoppingCart.items = this.shoppingCart.items.splice(index, 1);
      } else {
        this.shoppingCart.items[index].quantity--;
      }
    }

    let shoppingCart = await this.getOrCreateShoppingCart();

    shoppingCart = this.shoppingCart;

    this.shoppingCartCollection
      .doc(shoppingCart.id)
      .set(shoppingCart)
      .then(() =>
        console.log('Product removed from shopping cart successfully')
      )
      .catch(error =>
        console.error('Error removing product in shopping cart', error)
      );
  }

  async clearShoppingCart(): Promise<void> {
    this.shoppingCart.items = [];

    let shoppingCart = await this.getOrCreateShoppingCart();
    shoppingCart = this.shoppingCart;

    this.shoppingCartCollection
      .doc(shoppingCart.id)
      .set(shoppingCart)
      .then(() => console.log('Items cleared from shopping cart successfully'))
      .catch(error =>
        console.error('Error clearing items in shopping cart', error)
      );
  }

  getShoppingCart(): ShoppingCart {
    return this.shoppingCart;
  }

  getTotalQuantiy(): number {
    let totalQuantity = 0;

    this.shoppingCart.items.forEach(item => (totalQuantity += item.quantity));

    return totalQuantity;
  }
}
