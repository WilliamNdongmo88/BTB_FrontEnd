import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterCredentials } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class RegisterComponent {
    registerForm: FormGroup;
    submitted = false;
    invalidCredentials = false;
    error: string | null = null;
    private registerSubscripton: Subscription | null = null;
    loading = false;
    isError = false;
    errorMessage: string = '';
    

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
        this.registerForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
        });
    }

    get f() {
        return this.registerForm.controls;
    }

    register() {
      this.loading = true;
      this.submitted=true;
      this.registerSubscripton = this.authService.register( this.registerForm.value as RegisterCredentials ).subscribe({
          next: result => {
              console.log('result :: '+ JSON.stringify(result));
              this.navigateHome(); 
          },
          error: (err) => {
              this.loading = false;
              this.isError=true;
              console.error('Erreur API :', err);
              this.errorMessage  = err.error.message.split(':')[1].trim();
              this.submitted = false;
              this.registerForm.reset();
          },
          complete: () => {
              this.loading = false;
              this.submitted = false;
          }
      });
    }

    navigateHome() {
      this.router.navigate(['/active-code']).then(
        success => {
          console.log('Navigation réussie ?', success);
          if (!success) {
            console.error('Échec de la navigation vers /active-code');
          }
        },
        error => {
          console.error('Erreur lors de la navigation :', error);
        }
      );
    }

    ngOnDestroy(): void {
      this.registerSubscripton?.unsubscribe();
    }
}