import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { InterfaceProduct } from '../interface/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

	private apiUrl = 'http://localhost:8050/api/product';

  	constructor(private http: HttpClient) {}

	// getAllProducts(): Observable<any> {
	// 	const token = localStorage.getItem('token');
	// 	const headers = new HttpHeaders({
	// 	'Content-Type': 'application/json',
	// 	'Authorization': `Bearer ${token}`
	// 	});
	// 	console.log("Headers envoyés:", JSON.stringify(headers)); // Vérifiez le header "Authorization"
	// 	console.log('Appel GET vers:', this.apiUrl);
	// 	return this.http.get<any>(this.apiUrl+'/all_product', {   headers, responseType: 'json' }).pipe(
	// 		catchError(error => {
	// 			console.error('Erreur lors de l’appel API :', error);
	// 			return throwError(() => error);
	// 		})
	// 	);
	// }

	getAllProducts(): Observable<any> {
		return this.http.get(`${this.apiUrl}/all_product`).pipe(
		catchError(error => {
			console.error('API Error:', {
			status: error.status,
			message: error.message,
			error: error.error
			});
			
			if (error.status === 401) {
			localStorage.removeItem('token'); // Nettoyage du token invalide
			// Redirigez vers /login si nécessaire
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

	// getId(id: number): Observable<Product> {
	// 	const token = localStorage.getItem('token');
	// 	const headers = new HttpHeaders({
	// 		'Content-Type': 'application/json',
	// 		'Authorization': `Bearer ${token}` // Le header important !
	// 	});
	// 	return this.http.get<Product>(`${this.apiUrl}/${id}`, {   headers, responseType: 'json' });
	// }

}
