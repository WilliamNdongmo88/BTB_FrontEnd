import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from "rxjs";
import { User } from "../models/user.model";
import { Route, Router } from "@angular/router";

 export interface LoginCredentials {
    email: string,
    password: string
 }

 export interface RegisterCredentials {
    name: string,
	email: string,
    password: string
 }

 export interface NewPassworCredentials {
    code: string,
	email: string,
    password: string
 }

 export interface ActiveCodeCredentials {
    code: string,
 }

 export interface NewActiveCodeCredentials {
    email: string,
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
	private authToken = new BehaviorSubject<string | null>(null);//Pour suivre le token dans tte l'appli
	user = signal<User | undefined| null>(undefined);
    userGoogle = signal<User | undefined| null>(undefined);
	isUserGoogle: Boolean = false;
	isUserLogin: Boolean = false;
	isDashboard = signal(false);
	userEmail: String = '';
  
  	constructor(private router: Router){}

	register(credentials: RegisterCredentials): Observable<User | null | undefined> {
        console.log('Credentials Sending:', credentials);
		return this.http.post(this.apiUrl+'inscription', credentials).pipe(
			tap((result: any) => {
				console.log('result :=>', result);
				const user = Object.assign(new User(), result['user']);
				this.user.set(user);
				console.log('user :=>', user);
			}),
			map((result: any) => { 
				return this.user(); })
		)
    }

	active(credentials: ActiveCodeCredentials): Observable<User | null | undefined> {
		console.log('Credentials Sending:', credentials);
        return this.http.post(this.apiUrl+'activation', credentials).pipe(
			tap((result: any) => {
				console.log('result :=>', result)
			}),
			map((result: any) => { 
				return null; 
			})
		)
    }

	new_active_code(credentials: NewActiveCodeCredentials): Observable<User | null | undefined> {
		console.log('Credentials Sending:', credentials);
        return this.http.post(this.apiUrl+'new-activation-code', credentials).pipe(
			tap((result: any) => {
				console.log('result :=>', result)
			}),
			map((result: any) => { 
				return null; 
			})
		);
    }

	confirm_mail(credentials: NewActiveCodeCredentials): Observable<User | null | undefined> {
        console.log('Credentials Sending:', credentials);
		return this.http.post(this.apiUrl+'modified-password', credentials).pipe(
			tap((result: any) => {
				console.log('result :=>', result)
			}),
			map((result: any) => { 
				return null; 
			})
		);
    }

	new_pass(credentials: NewPassworCredentials): Observable<User | null | undefined> {
        console.log('Credentials Sending:', credentials);
		return this.http.post(this.apiUrl+'new-password', credentials).pipe(
			tap((result: any) => {
				console.log('result :=>', result)
			}),
			map((result: any) => { 
				return null; 
			})
		)
    }

	check_email(credentials: NewActiveCodeCredentials) {
		console.log('Credentials Sending:', credentials);
		return this.http.post(this.apiUrl+'check-email', credentials).pipe(
			tap((result: any) => {
				console.log('result :=>', result)
				this.userEmail = result.email;
				console.log('this.userEmail :=>', this.userEmail)
			}),
			map((result: any) => { 
				return null; 
			})
		)
	}

	check_pass_before_connected(pass: any) {
		this.isUserLogin = true;
		this.isUserGoogle = false;
		return this.http.post(this.apiUrl+'check-password', {email: this.userEmail, password: pass}).pipe(
			tap((result: any) => {
				console.log('result :=>', result);
				localStorage.setItem('token', result['token']);
				localStorage.setItem('refreshToken', result['refresh']);
				const user = Object.assign(new User(), result['user']);
				this.user.set(user);
				console.log('user :=>', user);
			}),
			map((result: any) => { 
				return null; 
			})
		)
	}
    
	connexion(credentials: LoginCredentials): Observable<User | null | undefined> {
		this.isDashboard.set(false);
		this.isUserLogin = true;
		this.isUserGoogle = false;
		console.log('Credentials Sending:', credentials);
		return this.http.post(this.apiUrl+'connexion', credentials).pipe(
			tap((result: any) => {
				console.log('[AuthService] result :=>', result);
				localStorage.setItem('token', result['token']);
				const user = Object.assign(new User(), result['user']);
				this.user.set(user);
				console.log('user :=>', user);
			}),
			map((result: any) => { 
				return this.user(); })
		)
	}

	refreshToken(): Observable<any> {
		console.log('Credentials Sending:', {refresh:localStorage.getItem('refreshToken')});
		return this.http.post(this.apiUrl+'refresh-token', {refresh:localStorage.getItem('refreshToken')})
		.pipe(
			tap((result: any) => {
				console.log('[AuthService] Nouveau token reçu:', result);
				localStorage.removeItem('token');
				localStorage.setItem('token', result['token']);
			}),
			catchError(err => {
				console.error('[AuthService] Erreur de refreshToken:', err);
				return throwError(() => err);
			})
		);
	}

	loginWithGoogle(googleIdToken: string): Observable<any> {
		this.setIsDashboard(false);
		this.isUserLogin = false;
		this.isUserGoogle = true;
		return this.http.post(this.apiUrl+'auth/google', { idToken: googleIdToken }).pipe(
        tap((res) =>{
				const authData = res as any;
				console.log('[Login] data du backend :', authData);

				localStorage.setItem('token', authData.token);
				localStorage.setItem('refreshToken', authData.refresh);
				console.log('[Login] Token stocké:', authData.token);

				const userObj = {
					id:authData.user.id,
					name: authData.user.name,
					email: authData.user.email,
					actif: authData.user.actif,
					role: authData.user.role.libelle,
				};
				this.user.set(userObj);
			},
		),
        map((result: any) => { return this.isUserGoogle; }),
		catchError((error) => {
			console.error('Erreur d\'authentification :', error);
			this.user.set(null);
			return of(null);
		})
      );      
    }

	setToken(token: string) {
		this.authToken.next(token);
	}

	getToken(): Observable<string | null> {
		return this.authToken.asObservable();
	}

    // Méthode helper pour extraire les infos utilisateur du TOKEN
     extractUserFromToken(token: string) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
		console.log('[AuthService] payload '+  JSON.stringify(payload));
		  const newLocal = {
			  id:payload.id,
			  name: payload.nom,
			  email: payload.sub,
			  actif: true,
			  role: payload.role
		  };
		  this.user.set(newLocal);
		  console.log('[AuthService] this.userGoogle '+  JSON.stringify(this.user()));
      } catch (e) {
        console.error('Erreur de décodage du token', e);
      }
    }

	setIsDashboard(value: boolean) {
		console.log('#####setIsDashboard : ', value)
		this.isDashboard.set(value);
	}

	getisDashboard(): boolean {
		return this.isDashboard();
	}

	getUser() {
      return this.user(); 
    }

    isAuthenticated(): boolean {
      return !!localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
      const token = localStorage.getItem('token');
      //console.log('!!token :: '+ !!token);
      return !!token;
    }

    logout(): Observable<Boolean | null | undefined> {
		return this.http.post(this.apiUrl+'deconnexion',  {}).pipe(
        tap((res) =>{
			console.log('Déconnexion réussie: ', res)
			// if (this.isUserGoogle) {
			// 	localStorage.removeItem('token');
			// 	localStorage.removeItem('refreshToken');
			// 	this.router.navigate(['/login']);
			// } else if (this.isUserLogin) {
			// 	localStorage.removeItem('token');
			// 	localStorage.removeItem('refreshToken');
			// 	this.user.set(null);
			// 	this.router.navigate(['/connexion']);
			// }
		} ),
        map((result: any) => { return this.isUserGoogle; }),
      );      
    }
}