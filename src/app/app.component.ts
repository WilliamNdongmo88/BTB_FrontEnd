import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, 
            MatButtonModule, MatIconModule, 
            MatProgressSpinnerModule,CommonModule,
            RouterModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent implements OnInit{
    showMenu = false;
	  loading = false;
    isMobile = false;
    url: string = '';
    isAdmin = false;
    currentUser: any;
    showDropdown: Boolean = false;

   	private router = inject(Router);
    authService = inject(AuthService);
    readonly isDashboard = this.authService.isDashboard;

    constructor() {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const url = event.urlAfterRedirects;
          console.log('[AppComponent] URL changée :', url);
          if(url=="/login" || url=="/connexion" || url=="/"){
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('token');
            this.router.navigate(['login']);
          }
          this.isDashboard.set(url.startsWith('/admin'));
        }
      });
    }


    toggleMenu() {
      this.showMenu = !this.showMenu;
    }

    toggleDropdown(): void {
      this.showDropdown = !this.showDropdown;
    }

    @HostListener('window:resize')
    onResize() {
      this.isMobile = window.innerWidth < 768;
    }

    ngOnInit(): void {
      this.isMobile = window.innerWidth < 768;

      this.authService.getisDashboard();
      console.log('[app.component] isDashboard ::: ', this.isDashboard());
      const token = localStorage.getItem('token');
      if (token) {
        console.log('[app.component] currentUser :: ', this.authService.getUser());
        
        //this.authService.setToken(token); // Restaure le token  en mémoire 
        this.authService.extractUserFromToken(token); // Restaure le user en mémoire 
      }
      console.log('[app.component] token :: ', token);
      console.log('[app.component] authService.user() :: ', this.authService.getUser());
      console.log('[app.component] authService.isLoggedIn() :: ', this.authService.isLoggedIn()); 
    }

    logout() {
      this.loading = true; // Active le spinner
      this.authService.logout().subscribe({
              next: isUserGoogle => {
                localStorage.removeItem('token');
			          	localStorage.removeItem('refreshToken');
                  this.navigateToLogin();
                // if (isUserGoogle) {
                //   localStorage.removeItem('token');
			          // 	localStorage.removeItem('refreshToken');
                //   this.navigateToLogin();
                // } else {
                //   localStorage.removeItem('token');
				        //   localStorage.removeItem('refreshToken');
                //   this.navigateToConnexion();
                // }
                console.log('[AppComponent] result :: '+ isUserGoogle);
              },
              error: (err) => {
                  console.error('Erreur API :', err);
              },
              complete: () => {
                  this.loading = false;
              }
            });
      console.log('[app.component] isLoggedIn :: ', this.authService.isLoggedIn());
    }

    closeDropdownProf(): void {
      this.showDropdown = false;
    }

    navigatToDashboard(): void {
      this.authService.setIsDashboard(true);
      console.log('[app.component] isDashboard :: '+ this.isDashboard);
      this.showDropdown = !this.showDropdown;
      this.router.navigate(['/admin/products/add']);
    }

    // Écouteur d'événement pour fermer la picklist si l'on clique n'importe où sur le document
    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      const userDropdownContainer = document.querySelector('.user-dropdown-container');

      if (userDropdownContainer && !userDropdownContainer.contains(target)) {
        this.closeDropdownProf();
      }
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
