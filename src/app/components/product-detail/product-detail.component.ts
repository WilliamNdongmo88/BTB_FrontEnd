import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product!: Product;
  productId!: number;
  loading = true;
  errorMessage = '';
  router: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Récupère l'id dans l'URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.productId) {
      this.productService.getId(this.productId).subscribe({
        next: (prod) => {
          this.product = prod;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = "Erreur de chargement du produit.";
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = "ID de produit invalide.";
      this.loading = false;
    }
  }

    goBack(): void {
      this.router.navigate(['/page-products']); // ou vers une autre route selon ta structure
    }
}
