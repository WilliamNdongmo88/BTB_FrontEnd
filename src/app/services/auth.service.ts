import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, map, Observable, of, tap, throwError } from "rxjs";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

 export interface LoginCredentials {
    username: string,
    password: string
 }

 interface LoginResponse {
    [x: string]: any;
    Bearer: string,
    refresh: string
 }

@Injectable({ providedIn: 'root' })
export class AuthService {

    private http = inject(HttpClient);
	private apiUrl = 'http://localhost:8050/api/'; 
	user = signal<User | undefined | null>(undefined);
	private userGoogleSubject = new BehaviorSubject<any | null>(null);

	constructor(private router: Router) {}

    
    connexion(credentials: LoginCredentials): Observable<User | null | undefined> {
		console.log('Credentials Sending:', credentials);
 		return this.http.post(this.apiUrl+'connexion', credentials).pipe(
 			tap((result: any) => {
				console.log('result :=>', result);
 				localStorage.setItem('token', result['token']);
 				const user = Object.assign(new User(), result['user']);
 				this.user.set(user);
 			}),
 			map((result: any) => { 
				return this.user(); })
 		)
 	}

	// auth.service.ts
	loginWithGoogle(idToken: string) {
	return this.http.post<{ token: string }>(
		'http://localhost:8050/api/auth/google', 
		{ idToken },
		{ 
		headers: { 'Content-Type': 'application/json' },
		observe: 'response' // Pour avoir toute la réponse
		}
	).pipe(
		tap(response => console.log('Réponse complète:', response)),
		map(response => response.body!)
	);
	}

 	logout() {
 		return this.http.get('http://localhost:8050/api/deconnexion').pipe(///sessions/logout/
 			tap((result: any) => {
 				localStorage.removeItem('token');
 				this.user.set(null);
 			})
 		)
 	}

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

	setToken(token: string): Observable<any> {
		localStorage.setItem('auth_token', token);
		
		// Optionnel : Validation côté serveur
		return this.http.get('/auth/validate-token', {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/json' 
		}
		}).pipe(
		tap({
			error: () => {
			// Si la validation échoue, on nettoie
			localStorage.removeItem('auth_token');
			}
		})
		);
	}

	getUserGoogle() {
		return this.userGoogleSubject.value;
	}

	setUserGoogle(user: any) {
		this.userGoogleSubject.next(user);
	}

	getUser(): Observable<any> {
		// const token = localStorage.getItem('jwt');
		const token = localStorage.getItem('token');

		if (!token) {
			return throwError(() => new Error('Pas de token'));
		}

		const payload = JSON.parse(atob(token.split('.')[1])); // récupère le user
		console.log('payload :: '+ JSON.stringify(payload));
		this.setUserGoogle(payload);
		return of(payload);
	}

	isAuthenticated(): boolean {
		console.log('isAuthenticated :: '+ !!localStorage.getItem('token'));
		return !!localStorage.getItem('token');
	}

	logoutUserGoogle() {
		localStorage.removeItem('token');
		this.userGoogleSubject.next(null);
		const google = (window as any).google;
		if (google && google.accounts && google.accounts.id) {
			google.accounts.id.disableAutoSelect();
		}

  		this.router.navigate(['/login']);
	}
}
