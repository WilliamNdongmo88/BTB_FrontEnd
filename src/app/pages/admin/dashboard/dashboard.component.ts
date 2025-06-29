import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-create',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    CommonModule
  ]
})
export class DashboardComponent {
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  categories = ['Électronique', 'Vêtements', 'Maison', 'Sport'];

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    image: [null]
  });
  }
  

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      Object.entries(this.productForm.value).forEach(([key, value]) => {
        // if (value !== null) formData.append(key, value);
      });
      console.log('Produit soumis :', this.productForm.value);
    }
  }
}
