import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, map, Observable, of, tap, throwError } from "rxjs";
import { User } from "../models/user.model";
import { Route, Router } from "@angular/router";

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
    userGoogle = signal<User | null>(null);
	isUserGoogle: Boolean = false;
	isUserLogin: Boolean = false;
  
  	constructor(private router: Router){}

    
	connexion(credentials: LoginCredentials): Observable<User | null | undefined> {
		this.isUserLogin = true;
		this.isUserGoogle = false;
		console.log('Credentials Sending:', credentials);
		return this.http.post(this.apiUrl+'connexion', credentials).pipe(
			tap((result: any) => {
				console.log('result :=>', result);
				localStorage.setItem('token', result['token']);
				const user = Object.assign(new User(), result['user']);
				this.user.set(user);
				console.log('user :=>', user);
			}),
			map((result: any) => { 
				return this.user(); })
		)
	}

 	getUser(): Observable<User | null | undefined> {
 		return this.http.get('http://localhost:8050/sessions/me/').pipe(
 			tap((result: any) => {
 				const user = Object.assign(new User(), result);
 				this.user.set(user);
 			}),
 			map((result: any) => { return this.user(); })
		)
 	}

 	// logout() {
 	// 	return this.http.get('http://localhost:8050/api/deconnexion').pipe(///sessions/logout/
 	// 		tap((result: any) => {
 	// 			localStorage.removeItem('token');
 	// 			this.user.set(null);
 	// 		})
 	// 	)
 	// }

    loginWithGoogle(googleIdToken: string) {
		this.isUserLogin = false;
		this.isUserGoogle = true;
		this.http.post('http://localhost:8050/api/auth/google', { idToken: googleIdToken })
			.subscribe({
			next: (res) => {
				// data du backend
				const authData = res as any;
				console.log('[Login] data du backend :', authData);
				
				// Stocke le token
				localStorage.setItem('token', authData.token);
				console.log('[Login] Token stocké:', authData.token);

				// Définis l'utilisateur
				const userObj = {
				name: authData.user.name,
				email: authData.user.email,
				actif: authData.user.actif,
				};
				this.userGoogle.set(userObj);

				// ATTENDS un tick pour être sûr que localStorage est dispo
				// setTimeout(() => {
				//   console.log('[Login] Navigation après stockage');
				//   this.router.navigate(['/home']);
				// }, 1000);
				Promise.resolve().then(() => {
				console.log('[Login] Navigation après Promise.resolve()');
				this.router.navigate(['/home']);
				});
			},
			
			error: (err) => {
				console.error('Erreur d\'authentification :', err);
				this.userGoogle.set(null);
			}
			});
    }


    // Méthode helper pour extraire les infos utilisateur du TOKEN
    private extractUserFromToken(token: string): User | null {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          name: payload.name,
          email: payload.email,
          actif: false
        };
      } catch (e) {
        console.error('Erreur de décodage du token', e);
        return null;
      }
    }

    getUserGoogle() {
      return this.userGoogle(); 
    }

    isAuthenticated(): boolean {
      return !!localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
      const token = localStorage.getItem('token');
      //console.log('!!token :: '+ !!token);
      return !!token;
    }

    logout(): void {
		if (this.isUserGoogle) {
			localStorage.removeItem('token');
			this.router.navigate(['/login']);
		} else if (this.isUserLogin) {
			localStorage.removeItem('token');
			this.user.set(null);
			this.router.navigate(['/connexion']);
		}
    }
}