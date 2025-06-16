import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [MatIconModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product!: Product;
  productId!: number;
  loading = true;
  errorMessage = '';
  likeCount = 26;
  router: any;
  colors = ['#F87171', '#9CA3AF', '#A7F3D0', '#F3F4F6', '#60A5FA'];
  selectedImage: string = '';
  images: string[] = [
    'img/iphone.png',
    'img/iphone.png',
    'img/iphone.png'
  ];
  selectedColorIndex = 0;

  quantity = 1;
  stock = 12;
  postalCode = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  selectImage(image: string) {
    this.selectedImage = image;
  }

  selectColor(index: number) {
    this.selectedColorIndex = index;
  }

  increaseQuantity() {
    if (this.quantity < this.stock) this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  buyNow() {
    console.log('Buy Now clicked');
  }

  addToCart() {
    console.log('Add to Cart clicked');
  }

  getStarColor(index: number): string {
    const level = Math.floor(this.likeCount / 25); // 0–4
    return index < level ? 'gold' : 'lightgray';
  }

  ngOnInit(): void {
    // Récupère l'id dans l'URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.productId) {
      this.productService.getId(this.productId).subscribe({
        next: (prod) => {
          console.log('prodId ', prod);
          this.product = prod;
          this.images.push(prod.imageUrl);
          this.selectedImage = prod.imageUrl; 
          console.log('this.selectedImage ', this.images);
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = "Erreur de chargement du produit.";
          this.loading = false;
          const isTokenExpired = err.status === 400 && err.error?.message?.includes('token a expiré');
          
                  if (isTokenExpired) {
                    console.log('[ProductService] Token expiré, tentative de refresh...');
          
                    this.authService.refreshToken()
                    .pipe(
                      switchMap(() => this.productService.getAllProducts()), // Re-lance la requête après refresh
                      catchError(err => {
                        console.error('[ProductService] Refresh échoué:', err);
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        this.navigateToLogin();
                        return throwError(() => err);
                      })
                    );
                  }else if(err.status === 401){
                    localStorage.removeItem('token'); 
                    this.navigateToLogin();
                  }
        }
      });
    } else {
      this.errorMessage = "ID de produit invalide.";
      this.loading = false;
    }
  }
  navigateToLogin() {
    this.router.navigate(['login']);
  }

    goBack(): void {
      this.router.navigate(['/page-products']); // ou vers une autre route selon ta structure
    }
}
