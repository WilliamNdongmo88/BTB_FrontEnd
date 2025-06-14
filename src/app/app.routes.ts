import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { isLoggedInGuard } from './guards/is-logged-in.guard';
// import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActiveCodeComponent } from './pages/code-activation/active-code.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { PasswordComponent } from './pages/password/password.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: ProductListComponent,
        canActivate: [isLoggedInGuard]
    },
    { path: 'page-products/:id', component: ProductDetailComponent,canActivate: [isLoggedInGuard] },
    {path: 'login',component: LoginComponent},
    {path: 'connexion',component: ConnexionComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'active-code', component: ActiveCodeComponent },
    { path: 'new-password', component: NewPasswordComponent },
    { path: 'password', component: PasswordComponent },
];
