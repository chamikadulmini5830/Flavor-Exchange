import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
  <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Welcome Back!</mat-card-title>
          <mat-card-subtitle>Log in to your account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input matInput formControlName="username" placeholder="Enter your username">
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput type="password" formControlName="password" placeholder="Enter your password">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.valid">
                <mat-icon>login</mat-icon>
                Login
              </button>
            </div>

            <div class="error-message" *ngIf="loginError">
              <mat-icon>error</mat-icon>
              Invalid username or password
            </div>

            <div class="signup-link">
              Don't have an account? 
              <a routerLink="/signup" mat-button color="accent">Sign up</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>        
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      background: white;
    }

    mat-card-header {
      margin-bottom: 2rem;
      text-align: center;
      display: block;
    }

    mat-card-title {
      font-size: 2rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    mat-card-subtitle {
      font-size: 1rem;
      color: #7f8c8d;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    .mat-mdc-form-field {
      width: 100%;
    }

    mat-icon {
      margin-right: 8px;
      color: #7f8c8d;
    }

    .form-actions {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
    }

    .form-actions button {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #e74c3c;
      background-color: #fdf1f0;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .error-message mat-icon {
      color: #e74c3c;
    }

    .signup-link {
      margin-top: 1.5rem;
      text-align: center;
      color: #7f8c8d;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 1rem;
      }

      .login-card {
        padding: 1.5rem;
      }

      mat-card-title {
        font-size: 1.75rem;
      }
    }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      padding: 0 !important;
    }

    ::ng-deep .mat-mdc-form-field-infix {
      padding: 12px 0 !important;
      min-height: unset !important;
    }

    ::ng-deep .mdc-text-field--outlined {
      --mdc-outlined-text-field-container-shape: 4px;
    }

    ::ng-deep .mat-mdc-form-field-icon-prefix {
      padding: 0 8px;
    }

    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 4px 0 0 4px;
    }

    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing {
      border-radius: 0 4px 4px 0;
    }

    ::ng-deep .mat-mdc-form-field-flex {
      margin-top: 0 !important;
    }

    ::ng-deep .mat-mdc-form-field-required-marker {
      display: none !important;
    }

    ::ng-deep .mat-mdc-input-element {
      padding: 0 16px !important;
    }

    ::ng-deep .mat-mdc-form-field-label-wrapper {
      top: -0.5em;
    }

    ::ng-deep .mdc-floating-label--float-above {
      transform: translateY(-22px) scale(0.75) !important;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  email: string = '';
loginForm: any;
loginError: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.username, this.email);
    this.router.navigate(['/recipes']);
  }
}
