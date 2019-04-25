import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { map, startWith } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  totalQuantity: number;

  constructor(
    public auth: AuthService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    interval(1000)
      .pipe(
        startWith(0),
        map(() => this.shoppingCartService.getTotalQuantiy())
      )
      .subscribe(res => (this.totalQuantity = res));
  }
}
