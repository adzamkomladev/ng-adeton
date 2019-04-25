import { Component, OnInit, Input } from '@angular/core';

import { interval } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { ShoppingCartService } from '../shopping-cart.service';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { Item } from '../models/item';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() showActions = true;
  @Input() product: Product;
  shoppingCart: ShoppingCart;
  item: Item;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCart();

    interval(1000)
      .pipe(
        startWith(0),
        map(
          () =>
            this.shoppingCartService
              .getShoppingCart()
              .items.filter(item => item.product.id === this.product.id)[0]
        )
      )
      .subscribe(res => (this.item = res));
  }

  onAddToCart(): void {
    this.shoppingCartService.addProductToShoppingCart(this.product);
  }
}
