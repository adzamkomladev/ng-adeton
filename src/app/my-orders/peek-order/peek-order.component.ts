import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/order';
import { ShoppingCart } from 'src/app/models/shopping-cart';

@Component({
  selector: 'app-peek-order',
  templateUrl: './peek-order.component.html',
  styleUrls: ['./peek-order.component.css']
})
export class PeekOrderComponent implements OnInit {
  @Input() order: Order;
  @Input() shoppingCart: ShoppingCart;

  constructor() {}

  ngOnInit() {}

  totalPrice(): number {
    let totalPrice = 0;

    this.shoppingCart.items.forEach(
      item => (totalPrice += item.product.price * item.quantity)
    );

    return totalPrice;
  }
}
