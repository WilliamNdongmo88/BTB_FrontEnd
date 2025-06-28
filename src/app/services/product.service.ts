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
export class ProductService {
  
	private apiUrl = 'http://localhost:8050/api/product';

  	constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

	addProduct(productToSend: { name: any; price: any; description: any; productImage: MyFile, images: MyFile[]}) {
		console.log('Envoi du produit productToSend à l\'API (avec Base64) :', productToSend);
		return this.http.post<Product>(this.apiUrl+'/create', productToSend).pipe(
			tap((response) => console.log('Produit créé avec succès par l\'API :', response)),
			catchError(err => {
				console.error("[ProductService] Erreur de l'API : ", err.error.message);
				return throwError(() => err);
			})
		);
	}

	getAllProducts(): Observable<any> {
		console.log('get All Products');
		const token = localStorage.getItem('token');
		console.log('[ProductService] Token utilisé :', token);

		return this.http.get(`${this.apiUrl}/all_product`)
		.pipe(
			catchError(error => {
				console.error('API Error:', error);

				const isTokenExpired = error.status === 400 && error.error?.message?.includes('token a expiré');

				if (isTokenExpired) {
					console.log('[ProductService] Token expiré, tentative de refresh...');

					return this.authService.refreshToken()
					.pipe(
						switchMap(() => this.getAllProducts()), // Re-lance la requête après refresh
						catchError(err => {
							console.error('[ProductService] Refresh échoué:', err);
							localStorage.removeItem('token');
							localStorage.removeItem('refreshToken');
							this.navigateToLogin();
							return throwError(() => err);
						})
					);
				}else if(error.status === 401){
					localStorage.removeItem('token'); 
					this.navigateToLogin();
				}

				return throwError(() => error);
			})
		);
	}

	getProductById(id: number): Observable<Product> {
		console.log(`[ProductService] Récupération du produit avec l'ID : ${id}`);
		return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe( 
			tap((product) => console.log('Produit récupéré par ID :', product)),
			catchError(err => {
				console.error('[ProductService] Une erreur est survenue :', err.error.message);
				const isTokenExpired = err.status === 400 && err.error?.message?.includes('Token invalid ou inconnu');
				if(isTokenExpired){
					console.error('[ProductService] Token invalid ou inconnu');
					localStorage.removeItem('token');
					localStorage.removeItem('refreshToken');
					this.navigateToLogin();
				}
				return throwError(() => err);
			})
		);
	}

	updateProduct(id: number, updatedProduct: InterfaceProductToUpdate): Observable<Product> {
		console.log(`[ProductService] Mise à jour du produit ${id} avec les données :`, updatedProduct);
		return this.http.put<Product>(`${this.apiUrl}/${id}`, updatedProduct).pipe( 
		tap((response) => console.log('Produit mis à jour avec succès :', response)),
			catchError(err => {
				console.error('[ProductService] Une erreur est survenue :', err.error.message);
				return throwError(() => err);
			})
		);
	}

	deleteProduct(id: number): Observable<any> { 
		console.log(`[ProductService] Suppression du produit avec l'ID : ${id}`);
		return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe( 
			tap(() => console.log(`Produit ${id} supprimé avec succès.`)),
			catchError(err => {
				console.error('[ProductService] Une erreur est survenue :', err.error.message);
				return throwError(() => err);
			})
		);
	}

	deleteMultiple(ids: number[]) {
		return this.http.delete(`${this.apiUrl}`+'/delete-multiple', {
			body: ids,
			responseType: 'text' 
		});
	}


	navigateToLogin() {
		this.router.navigate(['login']);
	}
}
