import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartService } from '../shopping-cart.service';
import { Item } from '../models/item';

@Component({
  selector: 'app-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent implements OnInit {
  @Input() product: Product;
  @Input() item: Item;
  shoppingCart: ShoppingCart;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCart();
  }

  onAddToCart() {
    this.shoppingCartService.addProductToShoppingCart(
      this.product || this.item.product
    );
  }

  onRemoveFromCart() {
    this.shoppingCartService.removeProductFromShoppingCart(
      this.product || this.item.product
    );
  }
}
