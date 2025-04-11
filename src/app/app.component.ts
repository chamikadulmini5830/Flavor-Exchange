import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <mat-toolbar color="primary" class="navbar">
    <span class="brand">Flavor Exchange</span>
    <span class="spacer"></span>
    <nav class="nav-links">
      <button mat-button routerLink="/recipes" routerLinkActive="active">
        <mat-icon>menu_book</mat-icon>
        Recipes
      </button>
      <button mat-button *ngIf="authService.isAuthenticated()" routerLink="/favorites" routerLinkActive="active">
        <mat-icon>favorite</mat-icon>
        Favorites
      </button>
      <button mat-button *ngIf="authService.isAuthenticated()" routerLink="/add-recipe" routerLinkActive="active">
        <mat-icon>add_circle</mat-icon>
        Add Recipe
      </button>
      <button mat-button *ngIf="!authService.isAuthenticated()" routerLink="/login" routerLinkActive="active">
        <mat-icon>login</mat-icon>
        Login
      </button>
      <button mat-button *ngIf="!authService.isAuthenticated()" routerLink="/signup" routerLinkActive="active">
        <mat-icon>person_add</mat-icon>
        Signup
      </button>
      <button mat-button *ngIf="authService.isAuthenticated()" (click)="logout()">
        <mat-icon>logout</mat-icon>
        Logout
      </button>
    </nav>
  </mat-toolbar>
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      cursor: pointer;
      color:white;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      align-items: center;
      color:white;
    }

    .nav-links button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 16px;
      height: 36px;
      font-weight: 900;
      border-radius: 4px;
      transition: background-color 0.7s ease;
    }

    .nav-links button mat-icon {
      font-size: 20px;
      height: 20px;
      width: 20px;
      margin-right: 4px;
    }

    .nav-links button.active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-links button:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    .container {
      padding: 24px;
      margin-top: 64px;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0 16px;
      }

      .brand {
        font-size: 1.25rem;
      }

      .nav-links {
        gap: 4px;
      }

      .nav-links button {
        padding: 0 12px;
      }

      .nav-links button mat-icon {
        margin-right: 0;
      }

      .nav-links button span {
        display: none;
      }

      .container {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
