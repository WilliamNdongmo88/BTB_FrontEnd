import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {

    private http = inject(HttpClient);
    userGoogle = signal<User | null>(null);

    constructor(private router: Router) {}


    loginWithGoogle(googleIdToken: string) {
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
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
}