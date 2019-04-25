import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { ShoppingCartService } from 'src/app/shopping-cart.service';

@Component({
  selector: 'app-check-out-summary',
  templateUrl: './check-out-summary.component.html',
  styleUrls: ['./check-out-summary.component.css']
})
export class CheckOutSummaryComponent implements OnInit {
  shoppingCart: ShoppingCart;
  totalItems = 0;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCart();
    this.totalItems = this.shoppingCartService.getTotalQuantiy();
  }

  totalPrice(): number {
    let totalPrice = 0;

    this.shoppingCart.items.forEach(
      item => (totalPrice += item.product.price * item.quantity)
    );

    return totalPrice;
  }
}
