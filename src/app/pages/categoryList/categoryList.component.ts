import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CategoryService } from "../../services/category.service";
import { Router } from "@angular/router";
import { DialogService } from "../../services/dialogService";
import { SubCategory } from "../../models/subCategory.models";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './categoryList.component.html',
  styleUrls: ['./categoryList.component.scss']
})
export class CategoryListComponent implements OnInit{
  subCategories: SubCategory[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  pageSize: number = 5; 
  currentPage: number = 1;
  totalPages: number = 1; 
  paginatedsubCategories: SubCategory[] = []; 

  selectedSubCategoryIds: Set<number> = new Set<number>(); 
  selectAll: boolean = false; 

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadSubCategories();
  }

  loadSubCategories(): void {
    console.log(': refresh :');
    this.isLoading = true;
    this.error = null;
    this.selectedSubCategoryIds.clear();

    this.categoryService.getAllSubCategories().subscribe({
      next: (data) => {
        this.subCategories = data;
        this.isLoading = false;
        this.updatePagination();
        console.log('Produits chargés :', this.subCategories);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des SubCategory :', err);
        this.error = 'Impossible de charger les SubCategory. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.subCategories.length / this.pageSize);
    this.goToPage(this.currentPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedsubCategories = this.subCategories.slice(startIndex, endIndex);
      this.updateSelectAllStatus();
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

  refreshSubCategories(): void {
    this.loadSubCategories();
  }

  get numberOfSelectedGategories(): number {
    return this.selectedSubCategoryIds.size;
  }

  deleteSelectedProducts(): void {
    if (this.selectedSubCategoryIds.size === 0) {
      alert('Veuillez sélectionner au moins un produit à supprimer.');
      return;
    }
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.paginatedsubCategories.forEach(subCategory => this.selectedSubCategoryIds.add(subCategory.id));
    } else {
      this.paginatedsubCategories.forEach(subCategory => this.selectedSubCategoryIds.delete(subCategory.id));
    }
  }

  isSubCategoryIdSelected(subCategoryId: number): boolean {
    return this.selectedSubCategoryIds.has(subCategoryId);
  }

  toggleSubCategorySelection(subCategoryId: number): void {
    if (this.selectedSubCategoryIds.has(subCategoryId)) {
      this.selectedSubCategoryIds.delete(subCategoryId);
    } else {
      this.selectedSubCategoryIds.add(subCategoryId);
    }
    this.updateSelectAllStatus();
  }

  updateSelectAllStatus(): void {
    this.selectAll = this.paginatedsubCategories.every(subCategory => this.selectedSubCategoryIds.has(subCategory.id));
  }

  // editSubCategory(subCategoryId: number): void {
  //   this.router.navigate(['/sub_category/edit', subCategoryId]);
  // }

  deleteSubCategory(subCategoryId: number): void {
    this.dialogService.openConfirmationDialog(
      'Confirm Deletion',
      'Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.',
      'Yes, Delete It',
      'Cancel'
    ).subscribe(confirmed => {
      if (confirmed) {
        this.categoryService.deleteSubCategory(subCategoryId).subscribe({
          next: () => {
            console.log(`Produit ${subCategoryId} supprimé avec succès.`);
            this.loadSubCategories();
          },
          error: (err) => {
            console.error(`Échec de la suppression de la catégorie/sous catégorie ${subCategoryId} :`, err);
            alert('Erreur lors de la suppression de la catégorie/sous catégorie. Veuillez réessayer.');
          }
        });
      } else {
        console.log('Suppression annulée par l\'utilisateur.');
      }
    });
  }
}