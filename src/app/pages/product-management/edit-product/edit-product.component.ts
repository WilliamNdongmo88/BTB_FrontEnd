
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Importez ActivatedRoute et Router
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { MyFile } from '../../../models/myfile.model';
import { InterfaceProductToUpdate } from '../../../interface/product.interface';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  prodId!: number;
  fileName: string= '';
  convertImageToBase64: string='';
  imageproductGalleryBase64: MyFile[] = []; 
  productId: number | null = null; // Pour stocker l'ID du produit à modifier
  product: Product | null = null; // Pour stocker les données du produit existant

  // Les sections du formulaire (identiques à AddProductComponent)
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

  availableCategories = [
    'Fashion', 'Textile', 'Clothing', 'Digital Product', 'Style',
    'Electronics', 'Home Decor', 'Books', 'Sports'
  ];
  selectedCategories: string[] = []; // Pour les catégories si vous les incluez

  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute, // Pour accéder aux paramètres de l'URL
    private router: Router // Pour la redirection après modification
  ) {}

  ngOnInit(): void {
    this.initForms();
    // Récupérer l'ID du produit depuis l'URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id; // Convertir en nombre
        this.loadProductDetails(this.productId);
      } else {
        this.error = 'Product ID not provided.';
        this.isLoading = false;
        // Optionnel: rediriger si l'ID est manquant
        // this.router.navigate(['/products']);
      }
    });
  }

  private initForms(): void {
    this.basicInformationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.maxLength(1000)],
      price: [0, [Validators.required, Validators.min(0)]], // Ajout du champ prix
      brand: [''], // Si vous avez le champ brand dans votre modèle
    });
  }

  // Charge les détails du produit existant
  loadProductDetails(id: number): void {
    this.isLoading = true;
    this.prodId = id;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        // Pré-remplir le formulaire avec les données du produit
        this.basicInformationForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          // brand: product.brand, // Si vous avez le champ brand
        });

        // Pré-remplir les images Base64
        if (product.mainImage) {
          this.productImageBase64 = product.mainImage.content;
        }
        if (product.images) {
          this.productGalleryBase64 = product.images.map(img => img.content);
        }
        // Pré-remplir les catégories si elles sont présentes
        // if (product.category) {
        //   this.selectedCategories = [...product.category];
        // }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du produit :', err);
        this.error = 'Failed to load product details.';
        this.isLoading = false;
      }
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

  onProductImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        //this.convertImageToBase64 = reader.result?.slice(22) as string
        this.productImageBase64 = reader.result as string;
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
            //content: reader.result?.slice(22) as string
            content: reader.result as string
          };
          this.imageproductGalleryBase64.push(myFile);
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


  updateProduct(): void {
    if (this.basicInformationForm.invalid || this.selectedCategories.length === 0) {
        console.warn('Le formulaire d\'informations de base est invalide ou les catégories ne sont pas sélectionnées.');
        this.basicInformationForm.markAllAsTouched();
        alert('Veuillez remplir correctement tous les champs requis !');
        return;
    }

    if (!this.productImageBase64) {
      alert('Veuillez ajouter une image principale pour le produit.');
      return;
    }

    if (this.productId === null) {
      alert('Erreur: Product ID is missing for update.');
      return;
    }

    const formData = this.basicInformationForm.value;

    const myFile: MyFile = {
      name: this.fileName,
      content: this.productImageBase64
    };

    const productToUpdate: InterfaceProductToUpdate = {
      id: this.prodId,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      productImage: myFile,
      images: this.imageproductGalleryBase64,
    };
    console.log('[EditProductComponent] productToUpdate :', productToUpdate);
    this.isLoading = true;
    this.productService.updateProduct(this.productId, productToUpdate).subscribe({
      next: (response) => {
        console.log('Produit mis à jour avec succès :', response);
        alert('Produit mis à jour avec succès !');
        this.isLoading = false;
        this.router.navigate(['/admin/products']); // Rediriger vers la liste des produits
      },
      error: (error) => {
        console.error('Échec de la mise à jour du produit :', error.message);
        alert('Erreur lors de la mise à jour du produit. Voir la console pour plus de détails.');
      }
    });
  }
}