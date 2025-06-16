import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActiveCodeCredentials, AuthService, NewActiveCodeCredentials, NewPassworCredentials } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-connexion',
  standalone: true,
  templateUrl:'./new-password.component.html',
  styleUrl: './new-password.component.css',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatProgressSpinnerModule],
})
export class NewPasswordComponent{

    confirm_mailForm: FormGroup;
    new_passForm: FormGroup;
    submitted = false;
    isNewPass = false;
    invalidCredentials = false;
    loading = false;
    isError = false;
    isMatch = false;
    isValid = false;
    isNoValid = false;
    isDisabled = false;
    errorMessage: string = '';
    error = '';

    activeSubscripton: Subscription | null = null;
    new_activeSubscripton: Subscription | null = null;
    

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
      this.confirm_mailForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      });
      this.new_passForm = this.fb.group({
        code: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        c_password: ['', [Validators.required]]
      });
    }

    get f() {
      return this.confirm_mailForm.controls;
    }

    get nf() {
      return this.new_passForm.controls;
    }

    ngOnInit(): void {
      this.new_passForm.valueChanges.subscribe(val => {
        const pass = val.password;
        const confirm = val.c_password;

        if (pass && confirm) {
          if (pass === confirm) {
            this.isValid = true;
            this.isNoValid = false;
            this.isMatch = false;
          } else {
            this.isValid = false;
            this.isNoValid = true;
            this.isMatch = true;
          }
        } else {
          this.isValid = false;
          this.isNoValid = false;
          this.isMatch = false;
        }
      });
    }


    confirm_mail() {
        console.log('----active()----');
        this.submitted=true;
        this.isDisabled=true;
        if (this.isError) this.isError=false;
        if (this.confirm_mailForm.invalid) {
            return; // Stoppe la soumission si le champ est invalide
        }
        this.loading = true;
        this.activeSubscripton = this.authService.confirm_mail( this.confirm_mailForm.value as NewActiveCodeCredentials ).subscribe({
            next: result => {
                console.log('result :: '+ JSON.stringify(result));
                this.isNewPass=!this.isNewPass;
            },
            error: (err) => {
                this.loading = false;
                this.isError=true;
                console.error('Erreur API :', err);
                this.errorMessage  = err.error.message.split(':')[1].trim();
                this.submitted = false;
                this.new_passForm.reset();
            },
            complete: () => {
                this.loading = false;
                this.submitted = false;
                this.isError=false;
            }
        });
        setTimeout(() => {
          this.confirm_mailForm.reset();
				}, 20000);
    }
    
    new_pass() {
      if (this.isError){
        this.isError=!this.isError;
      } 
      console.log('----new_active()----');
      this.submitted = true;

      if (this.new_passForm.invalid) {
          return;
      }

      if (this.new_passForm.value.password === this.new_passForm.value.c_password) {
        console.log(' ---Match--- ');
          this.loading = true;
          this.authService.new_pass(this.new_passForm.value as NewPassworCredentials)
          .subscribe({
              next: (res) => {
                    console.log('API appelée avec succès');
                    console.log('res :: ', res);
                    // popup de confirmation
                    this.navigateHome();
                    this.new_passForm.reset();
              },
              error: (err) => {
                  this.loading = false;
                  this.isError=true;
                  console.error('Erreur API :', err);
                  this.errorMessage  = err.error.message.split(':')[1].trim();
                  this.submitted = false;
                  this.new_passForm.reset();
              },
              complete: () => {
                  this.loading = false;
                  this.submitted = false;
              }
          });
      }else{
          this.isMatch = true;
          console.log(' ---No-Match--- ', this.isMatch);
      }
    
    }


    changeBoolean(){
        // window.location.reload();
        this.isNewPass=!this.isNewPass;
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