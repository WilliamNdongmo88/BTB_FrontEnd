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
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AddProductComponent } from './pages/product-management/add-product/add-product.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { EditProductComponent } from './pages/product-management/edit-product/edit-product.component';

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
    { path: 'admin', component: DashboardComponent },
    {
    path: 'admin',
    component: MainLayoutComponent,
    children: [
      //{ path: 'admin', redirectTo: 'products/add', pathMatch: 'full' },
      { path: 'products/add', component: AddProductComponent },
      { path: 'products', component: ProductsComponent }, 
      { path: 'products/edit/:id', component: EditProductComponent },

      { path: 'analytics', component: AnalyticsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'coupons', component: CouponsComponent },
      { path: 'customer', component: CustomerComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  },
];
