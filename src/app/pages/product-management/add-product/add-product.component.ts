// src/app/pages/product-management/add-product/add-product.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { MyFile } from '../../../models/myfile.model';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  loading = false;
  errorMessage: string = '';
  fileName: string= '';
  convertImageToBase64: string='';
  imageproductGalleryBase64: MyFile[] = []; 
  // ... (votre code existant pour productSections, currentSection, etc.)
  productSections = [
    { label: 'Basic Information', key: 'basicInformation' },
    { label: 'General Information', key: 'generalInformation' },
    { label: 'Size Guide', key: 'sizeGuide' },
    { label: 'Inventory', key: 'inventory' },
    { label: 'Shipping', key: 'shipping' }
  ];
  currentSection: string = 'basicInformation';

  basicInformationForm!: FormGroup;

  // --- NOUVEAU : Variables pour stocker les images encodées en Base64 ---
  productImageBase64: string | null = null; // Pour l'image principale (Data URL Base64)
  productGalleryBase64: string[] = [];      // Pour la galerie (tableau de Data URL Base64)
  // Les prévisualisations utilisent désormais ces mêmes variables.
  // productGalleryPreviews: (string | ArrayBuffer | null)[] = []; // N'est plus nécessaire comme variable séparée

  availableCategories = [
    'Fashion', 'Clothing', 'Style', 'Home Decor', 'Sports'
  ];
  selectedCategories: string[] = [];

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token==null && refreshToken==null) {
      // localStorage.removeItem('token');
      // localStorage.removeItem('refreshToken');
      this.router.navigate(['login']);
    }
    this.initForms();
  }

  private initForms(): void {
    this.basicInformationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.maxLength(1000)],
      price: ['', Validators.required],
      brand: [''],
      category:['', Validators.required],
      // Note: Les champs d'images ne sont plus directement dans le formulaire
      // car nous gérons leur conversion et stockage en Base64 séparément.
      // Le formulaire ne contient que les données textuelles.
    });
  }

  selectSection(key: string): void {
    this.currentSection = key;
  }

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  // --- Mise à jour : Gestion de l'upload d'image principale avec encodage Base64 ---
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

      reader.readAsDataURL(file); // Lit le fichier et l'encode en Base64
    } else {
      this.productImageBase64 = null;
    }
  }

  // --- Mise à jour : Gestion de la galerie d'images avec encodage Base64 ---
  onProductGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files); // Convertir FileList en Array

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Ajoute chaque fichier encodé en Base64 au 
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
        reader.readAsDataURL(file); // Lit le fichier et l'encode en Base64
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
    if (this.basicInformationForm.invalid ) {// || this.selectedCategories.length === 0
        console.warn('Le formulaire d\'informations de base est invalide ou les catégories ne sont pas sélectionnées.');
        this.basicInformationForm.markAllAsTouched();
        alert('Veuillez remplir correctement tous les champs requis !');
        return;
    }

    // Vérifiez si une image principale est requise et manquante
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
      productImage: myFile,    
      images: this.imageproductGalleryBase64, // <-- ENVOIE LA GALERIE EN BASE64
    };
    console.log('ProductData a publier :', productData);
    this.loading = true;
    this.productService.addProduct(productToSend).subscribe({
      next: (responseProduct) => {
        console.log("Produit publié avec succès :", responseProduct);
        // Réinitialiser le formulaire et les données d'images
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