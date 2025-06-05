import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  template: `<p>Authentification en cours...</p>`
})
export class AuthCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.handleToken();
  }

  private handleToken(): void {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.authService.setToken(params['token']).subscribe({
          next: () => this.router.navigate(['/products']),
          error: (err) => {
            console.error('Token validation failed:', err);
            this.router.navigate(['/login'], {
              queryParams: { error: 'invalid_token' }
            });
          }
        });
      } else {
        this.router.navigate(['/login'], {
          queryParams: { error: params['error'] || 'missing_token' }
        });
      }
    });
  }
}