import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-card',
  imports: [MatIconModule, MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnInit{

  isLoading = false;
  isLoved = false;
  likeCount = 26;
  liked = false;

  @Input() product!: Product;

  ngOnInit(): void {
    console.log("[ProductCardComponent] product :: ", this.product);
  }

  getStarColor(index: number): string {
    const level = Math.floor(this.likeCount / 25);
    return index < level ? 'gold' : 'lightgray';
  }

  onLove(event: MouseEvent): void {
    console.log("J'adode le produit");
    event.stopPropagation();     // Empêche la propagation du clic
    event.preventDefault();      // Empêche le lien de s’activer

    this.isLoved = !this.isLoved;
  }

  onLoveClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault(); 
    if (!this.liked) {
      this.likeCount++;
      this.liked = true;
    } else {
      this.likeCount--;
      this.liked = false;
    }
  }

  onAddToCart(event: MouseEvent): void {
    console.log('Ajout dans le panier');
    event.stopPropagation();
    event.preventDefault();
  }
}
