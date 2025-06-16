import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterModule, MatProgressSpinnerModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  loading: boolean = false;

  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('[ProductListComponent] Token détecté avant chargement produits:', token);

    if (token) {
      this.loadProducts();
    } else {
      // Retente après un petit délai
      setTimeout(() => this.loadProducts(), 50);
    }
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        console.log('data : ', data);
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
        this.loading = false;
      }
    });
  }

}
