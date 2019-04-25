import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../order';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[];
  selectedOrder: Order;
  shoppingCart: ShoppingCart;

  constructor(
    private orderService: OrderService,
    private shoppingCartService: ShoppingCartService
  ) {}

  async ngOnInit() {
    this.orders = await this.orderService.getUserOrders();
  }

  async onSelect(order: Order): Promise<void> {
    this.selectedOrder = order;

    this.shoppingCart = await this.shoppingCartService.get(
      order.shoppingCartId
    );
  }
}
