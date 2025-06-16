import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, 
            MatButtonModule, MatIconModule, 
            MatProgressSpinnerModule,CommonModule,
            RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent implements OnInit{
    showMenu = false;
	  loading = false;
   	private router = inject(Router);
    authService = inject(AuthService);


    get isMobile(): boolean {
      return window.innerWidth < 768;
    }

    toggleMenu() {
      this.showMenu = !this.showMenu;
    }

    ngOnInit(): void {
      const token = localStorage.getItem('token');
      if (token) {
        //this.authService.setToken(token); // Restaurer le token  en mémoire 
        this.authService.extractUserFromToken(token); // Restaurer le user en mémoire 
      }
      console.log('[app.component] token :: ', token);
      console.log('[app.component] authService.user() :: ', this.authService.getUser());
      console.log('[app.component] authService.isLoggedIn() :: ', this.authService.isLoggedIn());
    }

    logout() {
      this.loading = true; // Active le spinner
      this.authService.logout().subscribe({
              next: isUserGoogle => {
                if (isUserGoogle) {
                  localStorage.removeItem('token');
			          	localStorage.removeItem('refreshToken');
                  this.navigateToLogin();
                } else {
                  localStorage.removeItem('token');
				          localStorage.removeItem('refreshToken');
                  this.navigateToConnexion();
                }
                console.log('[AppComponent] result :: '+ isUserGoogle);
              },
              error: (err) => {
                  console.error('Erreur API :', err);
              },
              complete: () => {
                  this.loading = false;
              }
            });
      //console.log('[app.component] isLoggedIn :: ', this.authService.isLoggedIn());
    }

    onback(){
      this.navigateHome();
    }

    navigateToLogin() {
      this.router.navigate(['login']);
    }

    navigateToConnexion() {
      this.router.navigate(['connexion']);
    }

    navigateHome() {
      this.router.navigate(['home']);
    }
}
