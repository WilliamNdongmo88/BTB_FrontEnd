import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product} from '../models/product.model';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { InterfaceProduct, InterfaceProductToUpdate} from '../interface/product.interface';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MyFile } from '../models/myfile.model';
import { Category, SubCategory } from '../models/subCategory.models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService{
    
    private apiUrl = 'http://localhost:8050/api';

    constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

    addCategory(categoryToSend: { title: any; slug: any}) {
		console.log('Envoi du produit categoryToSend à l\'API (avec Base64) :', categoryToSend);
		return this.http.post<Category>(this.apiUrl+'/category/create', categoryToSend)//, {responseType: 'text' as 'json' }
		.pipe(
			tap((response) => console.log('[CategoryService] Catégorie créé avec succès par l\'API :', response)),
			catchError(err => {
				console.error("[CategoryService] Erreur de l'API : ", err.error.message);
				return throwError(() => err);
			})
		);
	}

	getAllCategories(): Observable<any[]> {
		return this.http.get<Category[]>(this.apiUrl + '/category/all_category');
	}

	getAllSubCategories() {
		return this.http.get<SubCategory[]>(this.apiUrl + '/subCategory/all_subCategory');
	}

    addSubCategory(subCategoryToSend: { category: any; addedBy: any; title: any; slug: any; type: any }) {
		console.log('SubCategoryToSend à l\'API :', subCategoryToSend);
		return this.http.post(this.apiUrl+'/subCategory/create', subCategoryToSend)
		.pipe(
			tap((response) => console.log('[CategoryService] Sous Catégorie créé avec succès par l\'API :', response)),
			catchError(err => {
				console.error("[CategoryService] Erreur de l'API : ", err.error.message);
				return throwError(() => err);
			})
		);
	}

	getAllSubCategoryRelatedToCaegory(subCategoryId: number) {
		console.log(`[ProductService] recupération de la catégorie/sous catégorie avec l'ID : ${subCategoryId}`);
		return this.http.get<any>(this.apiUrl+'/subCategory/category'+`?id=${subCategoryId}`).pipe( 
			tap(() => console.log(`recupération de la catégorie/sous catégorie réussi.`)),
			catchError(err => {
				console.error('[CategoryService] Une erreur est survenue :', err.error.message);
				return throwError(() => err);
			})
		);
	}

	deleteSubCategory(subCategoryId: number) {
		console.log(`[ProductService] Suppression de la catégorie/sous catégorie avec l'ID : ${subCategoryId}`);
		return this.http.delete<any>(this.apiUrl+'/subCategory/'+`${subCategoryId}`).pipe( 
			tap(() => console.log(`Catégorie/sous catégorie ${subCategoryId} supprimé avec succès.`)),
			catchError(err => {
				console.error('[CategoryService] Une erreur est survenue :', err.error.message);
				return throwError(() => err);
			})
		);
	}
}
