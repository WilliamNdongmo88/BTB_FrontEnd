import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryDialogComponent } from '../../dialog/categorieDialog/category.dialog.component';
import { AuthService } from '../../services/auth.service';
import { CategoryListComponent } from '../categoryList/categoryList.component';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, FormsModule, CategoryListComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  loading = false;
  submitted = false;
  errorMessage: string = '';
  categories: { id: number, title: string, slug: string }[] = [];
  selectedCategory: number | null = null;
  categoryToSend: string = '';
  categoryId!: number;
    
    productSections = [
      { label: 'Liste des catégories et sous catégories', key: 'listCategory' },
      { label: "+ Ajouter une catégorie", key: 'category' },
      { label: '+ Ajouter une sous satégorie', key: 'subCategory' },
      // { label: 'Inventory', key: 'inventory' },
      // { label: 'Shipping', key: 'shipping' }
    ];
    currentSection: string = 'listCategory';
  
    categoryForm!: FormGroup;
    subCategoryForm!: FormGroup;
  
    selectedCategories: string[] = [];
  
    constructor(private fb: FormBuilder, 
      private dialog: MatDialog,
      private categoryService: CategoryService,
      private authService: AuthService,
      private router: Router) {}
  
    ngOnInit(): void {
      console.log('[CategoriesComponent] this.authService getUser: ', this.authService.getUser()?.id);
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      if (token==null && refreshToken==null) {
        this.router.navigate(['login']);
      }
      this.initForms();
      this.getAllCategories();
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

    getAllCategories(){
      this.categoryService.getAllCategories().subscribe({
        next: (data) => {
          this.categories = data;
          if (this.categories.length > 0) {
            this.selectedCategory = this.categories[0].id; //Définit la valeur par défaut
            this.categoryToSend = this.categories[0].title
            this.categoryId = this.categories[0].id;
            //console.log('[CategoriesComponent] this.categoryId : ', this.categoryId );
          }
          //console.log('[CategoriesComponent] this.categories : ', this.categories authService);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des catégories :', err);
        }
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
      this.submitted = true;
      
      if (this.currentSection === 'category') {
        if (this.categoryForm.invalid) {
          this.categoryForm.markAllAsTouched();
          alert('Veuillez remplir correctement tous les champs requis !');
          return;
        }
        const productData = this.categoryForm.value;
        const categoryToSend = {
          title: productData.name,
          slug: this.removeAccentsAndHyphenate(productData.name)
        };
        console.log('[CategoriesComponent] categoryToSend :', categoryToSend);
        this.loading = true;
        this.categoryService.addCategory(categoryToSend).subscribe({
          next: (responseCategory) => {
            this.categoryForm.reset();
            this.selectedCategories = [];
            this.getAllCategories();
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.categoryForm.reset();
            alert(err.error.message.split(':')[1]);
            console.error('Erreur API :', err.error.message);
          }
        });
      }
      else if (this.currentSection === 'subCategory') {
        if (!this.selectedCategory) {
          console.warn('Catégorie requise');
          return;
        }
        if (this.subCategoryForm.invalid) {
          this.subCategoryForm.markAllAsTouched();
          alert('Veuillez remplir correctement tous les champs requis !');
          return;
        }
        const productData = this.subCategoryForm.value;
        const category = {
          id: this.categoryId
        }
        const addedBy =  {
          id: this.authService.getUser()?.id
        }
        const subCategoryToSend = {
          category: category,
          addedBy: addedBy,
          title: productData.name,
          slug: this.removeAccentsAndHyphenate(productData.name),
          type:productData.type
        };
        console.log('[CategoriesComponent] subCategoryToSend :', subCategoryToSend);
        this.loading = true;
        this.categoryService.addSubCategory(subCategoryToSend).subscribe({
          next: (responseCategory) => {
            this.subCategoryForm.reset();
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

    }

    onCategoryChange(event: any) {
      const value = event.target.value;
      console.log('[CategoriesComponent] value:', value);
      for (let i = 0; i < this.categories.length; i++) {
        const element = this.categories[i];
        if (element.id==value) {
          console.log('[CategoriesComponent] element:', element.title);
          this.categoryId = element.id
        }
      }
      if (value === '__new__') {
        this.openDialog();
        // Vide la sélection
        setTimeout(() => {
          this.selectedCategory = null;
        });
      } else {
        this.selectedCategory = +value;
        console.log('[CategoriesComponent] this.selectedCategory ::', this.selectedCategory);
      }
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(CategoryDialogComponent, {
        width: '400px'
      });

      dialogRef.afterClosed().subscribe((result: {id: number, title: string, slug: string }) => {
        if (result) {
          console.log('[CategoriesComponent] results :', result); 
          this.categories.push({
            id: this.categories.length + 1,
            title: result.title,
            slug: result.slug
          });
          let index = this.categories.length;
          this.selectedCategory = this.categories[index-1].id;
          this.categoryId = result.id;
        }
      });
    }

    removeAccentsAndHyphenate(input: string): string {
      return input
        .normalize('NFD')                      // Sépare les accents
        .replace(/[\u0300-\u036f]/g, '')       // Supprime les accents
        .trim()                                // Supprime les espaces en trop
        .toLowerCase()                         // Met en minuscules
        .replace(/\s+/g, '-')                  // Remplace les espaces par des tirets
        .replace(/[^a-z0-9-]/g, '');           // Supprime tout caractère spécial sauf lettres, chiffres et tirets
    }
}
