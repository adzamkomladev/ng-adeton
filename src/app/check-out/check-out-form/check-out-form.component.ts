import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/order.service';
import { Order } from 'src/app/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out-form',
  templateUrl: './check-out-form.component.html',
  styleUrls: ['./check-out-form.component.css']
})
export class CheckOutFormComponent implements OnInit {
  form: FormGroup;
  order: Order;
  constructor(
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const data = this.form.value as Order;
    this.order = this.orderService.getOrder();

    this.order.name = data.name;
    this.order.address = data.address;
    this.order.city = data.city;
    this.order.dateOrdered = new Date();
    this.order.status = 'Completed';

    this.orderService
      .add(this.order)
      .then(() => this.router.navigate(['order-success']));
  }
}
