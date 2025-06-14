import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  isLoved = false;
  likeCount = 26;
  liked = false;

  @Input() product!: Product;

  //   product = {
  //   title: 'AirPods Max',
  //   description: 'A perfect balance of high-fidelity audio',
  //   price: 559.00,
  //   rating: 5,
  //   reviews: 121,
  //   imageUrl: 'assets/images/airpods-max.png'
  // };

  getStarColor(index: number): string {
    const level = Math.floor(this.likeCount / 25); // 0–4
    return index < level ? 'gold' : 'lightgray';
  }

  onLove(event: MouseEvent): void {
    console.log("J'adode le produit");
    event.stopPropagation();     // Empêche la propagation du clic
    event.preventDefault();      // Empêche le lien de s’activer

    this.isLoved = !this.isLoved;
  }

  onLoveClick(event: Event): void {
    event.stopPropagation(); // empêche la propagation du clic si l’élément est dans un <a>
    event.preventDefault();  // Empêche le lien de s’activer
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
    event.stopPropagation();     // Empêche la propagation du clic
    event.preventDefault();      // Empêche le lien de s’activer

    // ... ta logique d’ajout au panier
  }
}
