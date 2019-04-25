import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products$: Observable<Product[]>;
  private productsCollection: AngularFirestoreCollection<Product>;
  private productDoc: AngularFirestoreDocument<Product>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Product>(
      'products',
      productsCollectionRef => productsCollectionRef.orderBy('title', 'asc')
    );

    this.products$ = this.productsCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Product;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getAll(): Observable<Product[]> {
    return this.products$;
  }

  get(id: string): Observable<Product> {
    this.productDoc = this.productsCollection.doc(id);
    return this.productDoc.valueChanges().pipe(
      map(data => {
        data.id = id;
        return data;
      })
    );
  }

  add(product: Product) {
    this.productsCollection
      .add(product)
      .then(() => console.log('Product added successfully'))
      .catch(error => console.error('Error adding product', error));
  }

  update(product: Product) {
    this.productDoc = this.productsCollection.doc(product.id);
    this.productDoc
      .update(product)
      .then(() => console.log('Product updated successfully'))
      .catch(error => console.error('Error updating product', error));
  }

  delete(product: Product) {
    this.productDoc = this.productsCollection.doc(product.id);
    this.productDoc
      .delete()
      .then(() => console.log('Product deleted successfully'))
      .catch(error => console.error('Error deleting product', error));
  }
}
