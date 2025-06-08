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


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Initialisation du SDK Google Identity
    google.accounts.id.initialize({
      client_id: '661537133165-bak5ui2p3k1h5gadof82o5055ct1m1tg.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    // Rendu du bouton
    google.accounts.id.renderButton(
      document.getElementById('googleSignInDiv'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any) {
    const googleIdToken = response.credential;

    this.authService.loginWithGoogle(googleIdToken);
  }
}


