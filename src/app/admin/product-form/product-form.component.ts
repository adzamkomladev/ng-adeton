import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CategoryService } from 'src/app/category.service';
import { ProductService } from 'src/app/product.service';

import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$: Observable<Category[]>;
  product: Product = { title: '', category: '', imageUrl: '', price: 0.0 };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.categories$ = this.categoryService.getAll();

    const productID = this.route.snapshot.paramMap.get('id');

    if (productID) {
      this.productService
        .get(productID)
        .pipe(take(1))
        .subscribe(product => {
          if (product) {
            this.product = product;
          }
        });
    }
  }

  onSave(): void {
    if (this.product.id) {
      this.productService.update(this.product);
    } else {
      this.productService.add(this.product as Product);
    }

    this.router.navigate(['/admin/products']);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(this.product);
      this.router.navigate(['/admin/products']);
    }
  }
}
