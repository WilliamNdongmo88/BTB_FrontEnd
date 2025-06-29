import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product} from '../models/product.model';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { InterfaceProduct, InterfaceProductToUpdate} from '../interface/product.interface';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MyFile } from '../models/myfile.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService{
    private apiUrl = 'http://localhost:8050/api/category';

    constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

    addCategory(categoryToSend: { name: any}) {
		console.log('Envoi du produit categoryToSend à l\'API (avec Base64) :', categoryToSend);
		return this.http.post<Product>(this.apiUrl+'/create', categoryToSend).pipe(
			tap((response) => console.log('[CategoryService] Catégorie créé avec succès par l\'API :', response)),
			catchError(err => {
				console.error("[CategoryService] Erreur de l'API : ", err.error.message);
				return throwError(() => err);
			})
		);
	}

    addSubCategory(subCategoryToSend: { name: any; type: any }) {
		console.log('Envoi du produit subCategoryToSend à l\'API (avec Base64) :', subCategoryToSend);
		return this.http.post<Product>(this.apiUrl+'/create', subCategoryToSend).pipe(
			tap((response) => console.log('[CategoryService] Sous Catégorie créé avec succès par l\'API :', response)),
			catchError(err => {
				console.error("[CategoryService] Erreur de l'API : ", err.error.message);
				return throwError(() => err);
			})
		);
	}
}