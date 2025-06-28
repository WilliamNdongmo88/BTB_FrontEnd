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
  errorMessage: string = '';

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
        console.log('[ProductListComponent] data :: ', data[0]);
        this.products = data;
        console.log('this.products : ', this.products);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err.error);
        this.errorMessage  = err.error;
        const isTokenExpired = err.status === 400 && err.error?.message?.includes('Token invalid ou inconnu');
        if (isTokenExpired){
          localStorage.removeItem('token');
		      localStorage.removeItem('refreshToken');
          this.navigateToLogin();
        }
        this.loading = false;
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }

}
