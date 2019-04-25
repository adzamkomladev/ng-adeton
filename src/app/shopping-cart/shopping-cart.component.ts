import { Component, OnInit } from '@angular/core';

import { interval } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { ShoppingCartService } from '../shopping-cart.service';
import { Item } from '../models/item';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  items: Item[];
  totalQuantity: number;

  constructor(private shoppingCartService: ShoppingCartService) {}

  async ngOnInit() {
    interval(1000)
      .pipe(
        startWith(0),
        map(() => {
          return {
            items: this.shoppingCartService.getShoppingCart().items,
            total: this.shoppingCartService.getTotalQuantiy()
          };
        })
      )
      .subscribe(res => {
        this.items = res.items;
        this.totalQuantity = res.total;
      });
  }

  totalPrice(): number {
    let totalPrice = 0;

    this.shoppingCartService
      .getShoppingCart()
      .items.forEach(
        item => (totalPrice += item.product.price * item.quantity)
      );

    return totalPrice;
  }

  async onClearShoppingCart(): Promise<void> {
    this.shoppingCartService.clearShoppingCart();
  }
}
