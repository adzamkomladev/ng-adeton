import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from './models/category';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories$: Observable<Category[]>;
  private categoriesCollection: AngularFirestoreCollection<Category>;

  constructor(private afs: AngularFirestore) {
    this.categoriesCollection = this.afs.collection<Category>(
      'categories',
      categoriesCollectionRef => categoriesCollectionRef.orderBy('name', 'asc')
    );

    this.categories$ = this.categoriesCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Category;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getAll(): Observable<Category[]> {
    return this.categories$;
  }
}
