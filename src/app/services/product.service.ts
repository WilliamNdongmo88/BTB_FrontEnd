import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { InterfaceProduct } from '../interface/product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

	private apiUrl = 'http://localhost:8050/api/product';

  	constructor(private http: HttpClient, private authService: AuthService) {}

	// getAllProducts(): Observable<any> {
	// 	const token = localStorage.getItem('token');
  	// 	console.log('[ProductService] Token utilisé :', token);
	// 	return this.http.get(`${this.apiUrl}/all_product`).pipe(
	// 		catchError(error => {
	// 			console.error('API Error:', {
	// 			status: error.status,
	// 			message: error.message,
	// 			error: error.error
	// 			});
	// 			if(error.error.message.split(':')[1].trim()=="Le token a expiré"){
	// 				console.log('refresh token');
	// 				this.authService.refreshToken().subscribe({
	// 					next: res => {
	// 						switchMap(() => this.getAllProducts());// Re-lance la requête après refresh

	// 					},
	// 					error: (err) => {
	// 						console.error('[ProductService] Refresh échoué:', err);
	// 						localStorage.removeItem('token');
	// 						localStorage.removeItem('refreshToken');
	// 					},
	// 				});
	// 			}
	// 			if (error.status === 401) {
	// 				localStorage.removeItem('token'); // Nettoyage du token invalide
	// 				// Redirigez vers /login si nécessaire
	// 			}
				
	// 			return throwError(() => error);
	// 		})
	// 	);
	// }

	getAllProducts(): Observable<any> {
		const token = localStorage.getItem('token');
		console.log('[ProductService] Token utilisé :', token);

		return this.http.get(`${this.apiUrl}/all_product`).pipe(
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
							// Redirige vers login ici si besoin
							return throwError(() => err);
						})
					);
				}

				return throwError(() => error);
			})
		);
	}

	getId(id: number): Observable<any> {
		const token = localStorage.getItem('token');

		console.log('apiUrl: ', this.apiUrl +'/'+id );
		return this.http.get<InterfaceProduct>(this.apiUrl +'/'+id).pipe(
			map(productJson => Product.fromJson(productJson))
		);
	}

}
