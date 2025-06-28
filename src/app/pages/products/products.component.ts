import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importez FormsModule pour ngModel sur les checkboxes
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { DialogService } from '../../services/dialogService';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // --- Pagination Properties ---
  pageSize: number = 10; 
  currentPage: number = 1;
  totalPages: number = 1; 
  paginatedProducts: Product[] = []; 

  // --- Selection Properties ---
  selectedProductIds: Set<number> = new Set<number>(); // Stocke les IDs des produits sélectionnés
  selectAll: boolean = false; // Pour la case à cocher "Tout sélectionner"

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;
    this.selectedProductIds.clear(); // Clear selections on load

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        this.updatePagination(); // Mettre à jour la pagination après le chargement des produits
        console.log('Produits chargés :', this.products);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits :', err);
        this.error = 'Impossible de charger les produits. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  refreshProducts(): void {
    this.loadProducts();
  }

  editProduct(productId: number): void {
    this.router.navigate(['/products/edit', productId]);
  }

  deleteProduct(productId: number): void {
    this.dialogService.openConfirmationDialog(
      'Confirm Deletion',
      'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.',
      'Yes, Delete It',
      'Cancel'
    ).subscribe(confirmed => {
      if (confirmed) {
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            console.log(`Produit ${productId} supprimé avec succès.`);
            this.loadProducts(); // Recharger la liste des produits après la suppression
          },
          error: (err) => {
            console.error(`Échec de la suppression du produit ${productId} :`, err);
            alert('Erreur lors de la suppression du produit. Veuillez réessayer.');
          }
        });
      } else {
        console.log('Suppression annulée par l\'utilisateur.');
      }
    });
  }

  // --- Pagination Logic ---
  updatePagination(): void {
    this.totalPages = Math.ceil(this.products.length / this.pageSize);
    this.goToPage(this.currentPage); // Assurez-vous d'être sur une page valide
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedProducts = this.products.slice(startIndex, endIndex);
      this.updateSelectAllStatus(); // Mettre à jour le statut du "Tout sélectionner"
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  // --- Selection Logic ---
  isProductSelected(productId: number): boolean {
    return this.selectedProductIds.has(productId);
  }

  toggleProductSelection(productId: number): void {
    if (this.selectedProductIds.has(productId)) {
      this.selectedProductIds.delete(productId);
    } else {
      this.selectedProductIds.add(productId);
    }
    this.updateSelectAllStatus();
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.paginatedProducts.forEach(product => this.selectedProductIds.add(product.id));
    } else {
      this.paginatedProducts.forEach(product => this.selectedProductIds.delete(product.id));
    }
  }

  updateSelectAllStatus(): void {
    // Vérifie si tous les produits de la page actuelle sont sélectionnés
    this.selectAll = this.paginatedProducts.every(product => this.selectedProductIds.has(product.id));
  }

  get numberOfSelectedProducts(): number {
    return this.selectedProductIds.size;
  }

  // Exemple d'action sur les produits sélectionnés
  deleteSelectedProducts(): void {
    if (this.selectedProductIds.size === 0) {
      alert('Veuillez sélectionner au moins un produit à supprimer.');
      return;
    }

    this.dialogService.openConfirmationDialog(
      'Confirm Multiple Deletion',
      `Êtes-vous sûr de vouloir supprimer les ${this.selectedProductIds.size} produits sélectionnés ? Cette action est irréversible.`,
      'Yes, Delete All',
      'Cancel'
    ).subscribe(confirmed => {
      if (confirmed) {
        const productIdsToDelete = Array.from(this.selectedProductIds);
        console.log(`productIdsToDelete : `, productIdsToDelete);

        this.productService.deleteMultiple(productIdsToDelete).subscribe({
          next: (message: string) => {
            alert(message); // 👈 ici, on affiche le "Produits supprimés avec succès"
            this.loadProducts();
          },
          error: (err) => {
            alert('Erreur : ' + err.error.message || err.message);
          }
        });
      }
    });
  }
}
  