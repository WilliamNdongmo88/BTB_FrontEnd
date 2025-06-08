import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent{
    loginForm: FormGroup;
    submitted = false;
    invalidCredentials = false;
    error = '';

 	  private loginSubscripton: Subscription | null = null;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
    }


    get f() {
      return this.loginForm.controls;
    }

    login() {
      this.loginSubscripton = this.authService.connexion( this.loginForm.value as LoginCredentials ).subscribe({
        next: result => {
          console.log('result 111:: '+ JSON.stringify(result));
          this.navigateHome(); 
          },
        error: error => {
          console.error('Server response:', error.error);
          this.invalidCredentials = true; }
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