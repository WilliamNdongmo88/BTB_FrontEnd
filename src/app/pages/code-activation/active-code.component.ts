import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActiveCodeCredentials, AuthService, NewActiveCodeCredentials } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-connexion',
  standalone: true,
  templateUrl:'./active-code.component.html',
  styleUrl: './active-code.component.css',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class ActiveCodeComponent{
    activeForm: FormGroup;
    new_activeForm: FormGroup;
    submitted = false;
    isNewCode = false;
    invalidCredentials = false;
    loading = false;
    isError = false;
    errorMessage: string = '';
    error = '';

    activeSubscripton: Subscription | null = null;
    new_activeSubscripton: Subscription | null = null;
    

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
      this.activeForm = this.fb.group({
        code: ['', [Validators.required]],
      });
      this.new_activeForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      })
    }

    get f() {
      return this.activeForm.controls;
    }

    get nf() {
      return this.new_activeForm.controls;
    }

    active() {
        console.log('----active()----');
        this.submitted=true;
        if (this.activeForm.invalid) {
            return; 
        }

        this.loading = true;
        this.activeSubscripton = this.authService.active( this.activeForm.value as ActiveCodeCredentials ).subscribe({
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
                this.activeForm.reset();
            },
            complete: () => {
                this.loading = false;
                this.submitted = false;
            }
        });
        this.activeForm.reset();
        this.submitted=false;
    }

    new_active() {
      console.log('----new_active()----');
      this.submitted = true;

      if (this.new_activeForm.invalid) {
          return;
      }
      this.loading = true;
      this.authService.new_active_code(this.new_activeForm.value as NewActiveCodeCredentials)
          .subscribe({
            next: (res) => {
                console.log('API appelée avec succès');
                // popup de confirmation
                this.new_activeForm.reset();
                this.submitted = false;
            },
            error: (err) => {
                this.loading = false;
                this.isError=true;
                console.error('Erreur API :', err);
                this.errorMessage  = err.error.message.split(':')[1].trim();
                this.submitted = false;
                this.new_activeForm.reset();
            },
            complete: () => {
                this.loading = false;
                this.submitted = false;
            }
      });
    }


    changeBoolean(){
      this.isNewCode=!this.isNewCode;
      this.isError=!this.isError;
    }

    navigateHome() {
        this.router.navigate(['/connexion']).then(
          success => {
            console.log('Navigation réussie ?', success);
            if (!success) {
              console.error('Échec de la navigation vers /connexion');
            }
          },
          error => {
            console.error('Erreur lors de la navigation :', error);
          }
        );
    }

    ngOnDestroy(): void {
      this.activeSubscripton?.unsubscribe();
    }

}