import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService, NewActiveCodeCredentials } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  isLoadingG = false;
  isError = false;
  isEmailCorrect = false;
  errorMessage: string = '';
  private check_emailSubscripton: Subscription | null = null;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  
  ngOnInit (): void {
    // Initialisation du SDK Google Identity
    google.accounts.id.initialize({
      client_id: '661537133165-bak5ui2p3k1h5gadof82o5055ct1m1tg.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    // Rendu du bouton
    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "outline", // ou "filled_blue", "filled_black"
        size: "large",    // ou "small", "medium"
        text: "signin_with", // ou "signup_with", "continue_with", "signin"
        shape: "rectangular", // ou "pill", "circle", "square"
        logo_alignment: "center", // ou "center"
        width: 400, // Largeur personnalisée en pixels
      }
    );
  }

    handleCredentialResponse(response: any) {
      this.loading = true;
      this.cd.detectChanges(); //Force Angular à mettre à jour l’UI

      const googleIdToken = response.credential;

      this.authService.loginWithGoogle(googleIdToken).subscribe({
        next: (result) => {
          if (result) {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error('Erreur d\'authentification Google :', err);
        },
        complete: () => {
          this.loading = false;
          this.cd.detectChanges(); // MAJ l’UI quand c’est fini
        }
      });
    }



    onSubmit() {
      this.submitted = true;
      if(this.isError)this.isError=false;
      if (this.loginForm.valid) {
        this.loading = true;
        this.check_emailSubscripton = this.authService.check_email( this.loginForm.value as NewActiveCodeCredentials ).subscribe({
          next: result => {
              console.log('result :: ', result);
              this.navigateHome(); 
          },
          error: (err) => {
              this.loading = false;
              this.isError=true;
              console.error('Erreur API :', err);
              console.error('Erreur API :', err.error.message);
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
    }

    navigateHome() {
        this.router.navigate(['/password']).then(
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
}


