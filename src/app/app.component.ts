import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

   	private router = inject(Router);
    authService = inject(AuthService);
    

  ngOnInit(): void {
    console.log('authService user :: '+ this.authService.user());
  }

    logout() {
      this.authService.logoutUserGoogle();
    }

    // logout() {
    //   this.authService.logout().subscribe({
    //     next: _ => { this.navigateToLogin(); },
    //     error: _ => { this.navigateToLogin(); }
    //   })
    // }

    navigateToLogin() {
      this.router.navigate(['login']);
    }

    navigateHome() {
      this.router.navigate(['home']);
    }
}
