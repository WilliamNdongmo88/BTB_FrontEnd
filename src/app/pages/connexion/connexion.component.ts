import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-connexion',
  standalone: true,
  templateUrl:'./connexion.component.html',
  styleUrl: './connexion.component.css',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatProgressSpinnerModule],
})
export class ConnexionComponent{
    loginForm: FormGroup;
    submitted = false;
    invalidCredentials = false;
    loading = false;
    isError = false;
    errorMessage: string = '';
    error = '';

 	  private loginSubscripton: Subscription | null = null;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
    }


    get f() {
      return this.loginForm.controls;
    }

    login() {
      console.log('----login()----');
      this.submitted=true;
      console.log('this.loginForm.invalid '+ this.loginForm.invalid);
      if (this.loginForm.invalid) {
          return; 
      }
      this.loading = true;
      this.loginSubscripton = this.authService.connexion( this.loginForm.value as LoginCredentials ).subscribe({
        next: result => {
          console.log('[ConnexionComponent] result :: '+ JSON.stringify(result));
          this.navigateHome(); 
        },
        error: (err) => {
            this.loading = false;
            this.isError=true;
            console.error('Erreur API :', err);
            this.errorMessage  = err.error.message.split(':')[1].trim();
            this.submitted = false;
            this.loginForm.reset();
        },
        complete: () => {
            this.loading = false;
            this.submitted = false;
        }
      });
    }

    navigateHome() {
        this.router.navigate(['/home']).then(
          success => {
            console.log('Navigation réussie ?', success);
            if (!success) {
              console.error('Échec de la navigation vers /home');
            }
          },
          error => {
            console.error('Erreur lors de la navigation :', error);
          }
        );
    }

    ngOnDestroy(): void {
      this.loginSubscripton?.unsubscribe();
    }

}