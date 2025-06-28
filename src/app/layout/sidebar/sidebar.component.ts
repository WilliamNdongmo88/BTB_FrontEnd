import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  authService = inject(AuthService);

  navItems = [
    { icon: 'fas fa-chart-line', label: 'Analytics', link: '/admin/analytics' },
    { icon: 'fas fa-box', label: 'Products', link: '/admin/products' },
    { icon: 'fas fa-plus', label: 'Add Products', link: '/admin/products/add' }, 
    { icon: 'fas fa-th-large', label: 'Categories', link: '/admin/categories' },
    { icon: 'fas fa-receipt', label: 'Orders', link: '/admin/orders' },
    { icon: 'fas fa-exchange-alt', label: 'Transactions', link: '/admin/transactions' },
    { icon: 'fas fa-tags', label: 'Coupons', link: '/admin/coupons' },
    { icon: 'fas fa-users', label: 'Customer', link: '/admin/customer' },
    { icon: 'fas fa-cog', label: 'Settings', link: '/admin/settings' }
  ];

  currentUser = this.authService.getUser();

}