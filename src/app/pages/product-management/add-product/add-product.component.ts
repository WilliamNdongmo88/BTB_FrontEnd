// src/app/pages/product-management/add-product/add-product.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { MyFile } from '../../../models/myfile.model';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../../dialog/categorieDialog/category.dialog.component';
import { CategoryService } from '../../../services/category.service';
import { Category, SubCategory } from '../../../models/subCategory.models';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  loading = false;
  errorMessage: string = '';
  fileName: string= '';
  convertImageToBase64: string='';
  imageproductGalleryBase64: MyFile[] = []; 
  selectedCategory: number | null = null;
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  categoryId!: number;

  availableSubCategories: string[] = [];       // pour afficher les options
  selectedSubCategories: string[] = [];        // pour suivre ce que l'utilisateur a coché


  productSections = [
    { label: 'Basic Information', key: 'basicInformation' },
    { label: 'General Information', key: 'generalInformation' },
    { label: 'Size Guide', key: 'sizeGuide' },
    { label: 'Inventory', key: 'inventory' },
    { label: 'Shipping', key: 'shipping' }
  ];
  currentSection: string = 'basicInformation';

  basicInformationForm!: FormGroup;

  productImageBase64: string | null = null; 
  productGalleryBase64: string[] = [];   
  selectedCategories: string[] = [];

  constructor(private fb: FormBuilder, 
              private productService: ProductService, 
              private router: Router, 
              private dialog: MatDialog,
              private categoryService: CategoryService
            ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token==null && refreshToken==null) {
      this.router.navigate(['login']);
    }
    this.initForms();
    this.getAllCategories();
  }

  private initForms(): void {
    this.basicInformationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.maxLength(1000)],
      price: ['', Validators.required],
      brand: [''],
      category:['', Validators.required],
    });
  }

    getAllCategories(){
      this.categoryService.getAllCategories().subscribe({
        next: (data) => {
          this.categories = data;
          console.log('[AddProductComponent] this.categories ::: ', this.categories );
          if (this.categories.length > 0) {
            this.selectedCategory = this.categories[0].id;
            this.categoryId = this.categories[0].id;
            this.getAllSubCategories(this.categoryId)
          }
          //console.log('[CategoriesComponent] this.categories : ', this.categories authService);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des catégories :', err);
        }
      });
      return this.categoryId;
    }

    getAllSubCategories(value:any){
      this.categoryService.getAllSubCategoryRelatedToCaegory(value).subscribe({
        next: (data) => {
          this.subCategories = data;
          this.availableSubCategories = this.subCategories.map((s) => s.title);
          console.log('[AddProductComponent] this.subCategories ::: ', this.subCategories );
          //console.log('[subCategoriesComponent] this.subCategories : ', this.subCategories authService);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des catégories :', err);
        }
      });
    }

  selectSection(key: string): void {
    this.currentSection = key;
  }

  toggleCategory(subcategory: string): void {
    const index = this.selectedSubCategories.indexOf(subcategory);
    //console.log('[CategoriesComponent] index:', index);
    if (index > -1) {
      this.selectedSubCategories.splice(index, 1); // retiré de la sélection
      //console.log('[CategoriesComponent] on le retire de la sélection:', this.selectedSubCategories);
    } else {
      this.selectedSubCategories.push(subcategory); // ajouté à la sélection
      //console.log('[CategoriesComponent] on l’ajoute à la sélection:', this.selectedSubCategories);
    }
  }

  isCategorySelected(subcategory: string): boolean {
    return this.selectedSubCategories.includes(subcategory);
  }


    onCategoryChange(event: any) {
      const value = event.target.value;
      this.getAllSubCategories(value);
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

  //Image principale 
  onProductImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileName = file.name;
      const reader = new FileReader();
      console.log('file : ', file);
      reader.onload = () => {
        this.convertImageToBase64 = reader.result?.slice(22) as string
        this.productImageBase64 = reader.result as string;
        console.log('Image principale encodée en Base64:', this.productImageBase64.substring(0, 100) + '...'); // Log partiel pour ne pas inonder
      };
      reader.onerror = (error) => {
        console.error('Erreur de lecture du fichier:', error);
        this.productImageBase64 = null;
      };

      reader.readAsDataURL(file);
    } else {
      this.productImageBase64 = null;
    }
  }

  // Galerie d'images
  onProductGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.productGalleryBase64.push(reader.result as string);
          const myFile: MyFile = {
            name: file.name,
            content: reader.result?.slice(22) as string
          };
          this.imageproductGalleryBase64.push(myFile);
          // console.log('Image de galerie encodée en Base64:', (reader.result as string).substring(0, 100) + '...');
        };
        reader.onerror = (error) => {
          console.error('Erreur de lecture du fichier de galerie:', error);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeGalleryImage(index: number): void {
    if (this.productGalleryBase64.length > index) {
      this.productGalleryBase64.splice(index, 1);
    }
  }

  reviewForm(): void {
    console.log('Review Form clicked');
  }

  publishProduct(): void {
    if (!this.selectedCategory) {
      alert('Veuillez sélectionner une catégorie.');
      return;
    }

    if (this.basicInformationForm.invalid ) {// || this.selectedCategories.length === 0
        console.warn('Le formulaire d\'informations de base est invalide ou les catégories ne sont pas sélectionnées.');
        this.basicInformationForm.markAllAsTouched();
        alert('Veuillez remplir correctement tous les champs requis !');
        return;
    }

    if (!this.convertImageToBase64) {
      alert('Veuillez ajouter une image principale pour le produit.');
      return;
    }

    const productData = this.basicInformationForm.value;

    const myFile: MyFile = {
      name: this.fileName,
      content: this.convertImageToBase64
    };

    const productToSend = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      //category: this.selectedCategories,
      subCategories: this.selectedSubCategories,
      productImage: myFile,    
      images: this.imageproductGalleryBase64,
    };
    console.log('ProductData a publier :', productData);
    this.loading = true;
    this.productService.addProduct(productToSend).subscribe({
      next: (responseProduct) => {
        console.log("Produit publié avec succès :", responseProduct);
        this.basicInformationForm.reset();
        this.selectedCategories = [];
        this.productImageBase64 = null; // Réinitialise l'image principale
        this.productGalleryBase64 = []; // Réinitialise la galerie
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