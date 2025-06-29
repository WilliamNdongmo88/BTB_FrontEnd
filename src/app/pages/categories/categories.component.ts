import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  loading = false;
    errorMessage: string = '';
    
    productSections = [
      { label: "Catégorie", key: 'category' },
      { label: 'Sous Catégorie', key: 'subCategory' },
      // { label: 'Size Guide', key: 'sizeGuide' },
      // { label: 'Inventory', key: 'inventory' },
      // { label: 'Shipping', key: 'shipping' }
    ];
    currentSection: string = 'category';
  
    categoryForm!: FormGroup;
    subCategoryForm!: FormGroup;
  
    availableCategories = [
      'Fashion', 'Clothing', 'Style', 'Home Decor', 'Sports'
    ];
    selectedCategories: string[] = [];
  
    constructor(private fb: FormBuilder, 
      private productService: ProductService,
      private categoryService: CategoryService,
      private router: Router) {}
  
    ngOnInit(): void {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      if (token==null && refreshToken==null) {
        this.router.navigate(['login']);
      }
      this.initForms();
    }
  
    private initForms(): void {
      this.categoryForm = this.fb.group({
        name: ['', Validators.required]
      });
      this.subCategoryForm = this.fb.group({
        name: ['', Validators.required],
        type: [''],
      });
    }
  
    selectSection(key: string): void {
      this.currentSection = key;
      console.log('this.currentSection : ', this.currentSection );
    }
  
    reviewForm(): void {
      console.log('Review Form clicked');
    }
  
    publishProduct(): void {
      if (this.currentSection === 'category') {
        if (this.categoryForm.invalid) {
          this.categoryForm.markAllAsTouched();
          alert('Veuillez remplir correctement tous les champs requis !');
          return;
        }
        const categoryToSend = this.categoryForm.value;
        console.log('[CategoriesComponent] categoryToSend :', categoryToSend);
        this.loading = true;
        this.categoryService.addCategory(categoryToSend).subscribe({
          next: (responseCategory) => {
            this.categoryForm.reset();
            this.selectedCategories = [];
          },
          error: (err) => {
            this.loading = false;
            console.error('Erreur API :', err.error.message);
          },
          complete: () => {
              this.loading = false;
          }
        });
      }
      else if (this.currentSection === 'subCategory') {
        if (this.subCategoryForm.invalid) {
          this.subCategoryForm.markAllAsTouched();
          alert('Veuillez remplir correctement tous les champs requis !');
          return;
        }
        const subCategoryToSend = this.subCategoryForm.value;
        console.log('[CategoriesComponent] subCategoryToSend :', subCategoryToSend);
        this.loading = true;
        this.categoryService.addSubCategory(subCategoryToSend).subscribe({
          next: (responseCategory) => {
            this.categoryForm.reset();
            this.selectedCategories = [];
          },
          error: (err) => {
            this.loading = false;
            console.error('Erreur API :', err.error.message);
          },
          complete: () => {
              this.loading = false;
          }
        });
      }

      // if (this.categoryForm.value) {
      //   const productData = this.categoryForm.value;
      //   const categoryToSend = {
      //     name: productData.name
      //   };
      //   console.log('[CategoriesComponent] Data a publier :', categoryToSend);
        
      // }else if(this.subCategoryForm.value){
      //   console.log('[CategoriesComponent] this.subCategoryForm.value :', this.subCategoryForm.value);
      //   const subCategoryData = this.subCategoryForm.value;
      //   const subCategoryToSend = {
      //     name: subCategoryData.name,
      //     type: subCategoryData.type
      //   };
      // }

    }
}
