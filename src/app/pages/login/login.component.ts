// import { GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Route, Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   authService: any;
//   http: any;
//   loginForm: FormGroup;

//   constructor(private fb: FormBuilder,private route: ActivatedRoute, private router : Router) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]]
//     });
//   }

//   onSubmit(): void {
//     if (this.loginForm.valid) {
//       const email = this.loginForm.value.email;
//       console.log('Submitted Email:', email);
//       // Appelle ici ton service pour gérer l'envoi vers le backend
//     }
//   }

//   ngOnInit() {
//     // Vérifier si on revient de l'authentification avec un token
//     console.log("Vérifier si on revient de l'authentification avec un token");
//     this.route.queryParams.subscribe(params => {
//       console.log('params[token] : ', params['token']);
//       if (params['token']) {
//         localStorage.setItem('token', params['token']);
//         // Redirection vers la page d'accueil ou autre
//         this.router.navigate(['/home']);
//       }
//     });
//   }

//   loginWithGoogle() {
//     // Redirection complète (sans popup)
//     window.location.href = 'http://localhost:8050/api/oauth/google';
//   }

// }



// src/app/google-auth/google-auth.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-google-auth',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '661537133165-bak5ui2p3k1h5gadof82o5055ct1m1tg.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInDiv'),
      { theme: 'filled_blue', size: 'large' }
    );

    //google.accounts.id.prompt(); // Affiche automatiquement la boîte de dialogue
  }

  handleCredentialResponse(response: any) {
    const googleIdToken = response.credential;

    this.http.post<{ token: string }>('http://localhost:8050/api/auth/google', {
      idToken: googleIdToken
    }).subscribe({
      next: (res) => {
        console.log('Token JWT local reçu :', res.token);
        localStorage.setItem('jwt', res.token);

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
        
      },
      error: (err) => {
        console.error('Erreur lors de l\'authentification avec le backend :', err);
      }
    });
    console.log('Token envoyé au backend :', googleIdToken);
  }


}

