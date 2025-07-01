import { Component} from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Category } from '../../models/subCategory.models';

@Component({
  selector: 'app-category-dialog',
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './category.dialog.component.html',
  styleUrl: './category.dialog.component.scss'
})
export class CategoryDialogComponent {
  loading = false;
  newCategoryTitle: string = '';
  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    private categoryService: CategoryService
  ) {}

  
  createNewCategory() {
    this.loading = true;
    if (!this.newCategoryTitle.trim()) return;
    const categoryToSend = {
      title: this.newCategoryTitle.trim(),
      slug: this.slugify(this.newCategoryTitle)
    };

    //console.log('[CategoryDialogComponent] categoryToSend :', categoryToSend);
    this.categoryService.addCategory(categoryToSend).subscribe({
      next: (responseCategory: Category) => {
        console.log('[CategoryDialogComponent] responseCategory : ', responseCategory);
        const categoryToUse = {
          id: responseCategory.id,
          title: this.newCategoryTitle.trim(),
          slug: this.slugify(this.newCategoryTitle)
        };    
        console.log('[CategoryDialogComponent] categoryToUse : ',categoryToUse);
        this.dialogRef.close(categoryToUse); // renvoie la catégorie au composant parent
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API :', err.error.message);
      }
    });

  }

  cancel() {
    this.dialogRef.close(); // ferme le modal
  }

  slugify(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  }
}
