import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatProgressSpinnerModule],
})
export class PasswordComponent {
    check_passForm: FormGroup;
    submitted = false;
    loading = false;
    isError = false;
    errorMessage: string = '';
    private check_emailSubscripton: Subscription | null = null;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
        this.check_passForm = this.fb.group({
        password: ['', [Validators.required]]
        })
    }

    get f() {
        return this.check_passForm.controls;
    }

    onSubmit() {
      this.submitted = true;
      if (this.check_passForm.valid) {
        this.loading = true;
        const password = this.check_passForm.value.password;
        console.log('Submitted Email:', password);
        
        this.check_emailSubscripton = this.authService.check_pass_before_connected( this.check_passForm.value.password).subscribe({
          next: result => {
              console.log('result :: ', result);
              this.navigateHome()
          },
          error: (err) => {
              this.loading = false;
              this.isError=true;
              console.error('Erreur API :', err);
              console.error('Erreur API :', err.error.message);
              this.errorMessage  = err.error.message.split(':')[1].trim();
              this.submitted = false;
              this.check_passForm.reset();
          },
          complete: () => {
              this.loading = false;
              this.submitted = false;
              this.check_passForm.reset();
          }
        });
      }
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
}


