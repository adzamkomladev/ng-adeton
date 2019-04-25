import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList
} from '@angular/core';

import {
  TableFunctionsDirective,
  SortEvent,
  compare
} from 'src/app/table-functions.directive';

import { Subscription } from 'rxjs';

import { ProductService } from 'src/app/product.service';

import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  @ViewChildren(TableFunctionsDirective) headers: QueryList<
    TableFunctionsDirective
  >;

  private productsSubscription: Subscription;
  products: Product[] = [];
  filteredProducts: Product[] = [];

  page = 1;
  pageSize = 4;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productsSubscription = this.productService
      .getAll()
      .subscribe(
        products => (this.filteredProducts = this.products = products)
      );
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  filter(query: string): void {
    this.filteredProducts = query
      ? this.products.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase())
        )
      : this.products;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = [...this.products].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  get processedFilteredProducts(): Product[] {
    return this.filteredProducts
      .map(product => product)
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }
}
