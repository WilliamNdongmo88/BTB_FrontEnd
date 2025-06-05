import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, map, Observable, of, tap, throwError } from "rxjs";
import { User } from "../models/user.model";

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

    
    connexion(credentials: LoginCredentials): Observable<User | null | undefined> {
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

 	logout() {
 		return this.http.get('http://localhost:8050/api/deconnexion').pipe(///sessions/logout/
 			tap((result: any) => {
 				localStorage.removeItem('token');
 				this.user.set(null);
 			})
 		)
 	}

}