import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { Subscription, Observable } from 'rxjs';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../shopping-cart.service';
import { Item } from '../models/item';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productFilteringSubscription: Subscription;
  shoppingCart: ShoppingCart;

  constructor(
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productFilteringSubscription = this.productService
      .getAll()
      .pipe(
        switchMap(products => {
          this.filteredProducts = this.products = products;
          return this.route.queryParamMap;
        })
      )
      .subscribe(params => {
        const category = params.get('category');

        this.filteredProducts = category
          ? this.products.filter(product => product.category === category)
          : this.products;
      });

    this.shoppingCart = this.shoppingCartService.getShoppingCart();
  }

  ngOnDestroy(): void {
    this.productFilteringSubscription.unsubscribe();
  }
}
