import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  showDropdown: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  deconnexion(): void {
    this.showDropdown = false;
 
    //this.loading = true; // Active le spinner
    this.authService.logout().subscribe({
            next: isUserGoogle => {
              localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                this.router.navigate(['login']);
            },
            error: (err) => {
                console.error('Erreur API :', err);
            },
            complete: () => {
                //this.loading = false;
            }
          });
    console.log('[HeaderComponent] isLoggedIn :: ', this.authService.isLoggedIn());

  }

  profilHandle(): void{
    this.router.navigate(['profil']);
  }

  navigatToHome(): void {
    this.authService.setIsDashboard(false);
    this.showDropdown = !this.showDropdown;
    this.router.navigate(['/home']);
  }

  closeDropdown(): void{
    this.showDropdown = !this.showDropdown;
  }

  // Écouteur d'événement pour fermer la picklist si l'on clique n'importe où sur le document
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userDropdownContainer = document.querySelector('.user-dropdown-container'); 

    if (userDropdownContainer && !userDropdownContainer.contains(target)) {
      this.showDropdown = false;
    }
  }
}