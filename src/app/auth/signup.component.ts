import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signup',
  template: `
    <div class="signup-container">
      <mat-card class="signup-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join Flavor Exchange today</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" hideRequiredMarker>
              <mat-label>Full Name</mat-label>
              <mat-icon matPrefix>badge</mat-icon>
              <input matInput formControlName="name" placeholder="Enter your full name">
              <mat-error *ngIf="signupForm.get('name')?.invalid && signupForm.get('name')?.touched">
                {{ getErrorMessage('name') }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input matInput formControlName="username" placeholder="Choose a username">
              <mat-error *ngIf="signupForm.get('username')?.invalid && signupForm.get('username')?.touched">
                {{ getErrorMessage('username') }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" formControlName="email" placeholder="Enter your email">
              <mat-error *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched">
                {{ getErrorMessage('email') }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Create a password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched">
                {{ getErrorMessage('password') }}
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!signupForm.valid || isLoading">
                <mat-icon *ngIf="!isLoading">person_add</mat-icon>
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </div>

            <div class="error-message" *ngIf="signupError">
              <mat-icon>error</mat-icon>
              {{errorMessage}}
            </div>

            <div class="login-link">
              Already have an account? 
              <a routerLink="/login" mat-button color="accent">Log in</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .signup-card {
      width: 100%;
      max-width: 450px;
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
      background: linear-gradient(to right, #4CAF50, #45a049);
    }

    .form-actions button:hover {
      background: linear-gradient(to right, #45a049, #3d8b40);
    }

    .form-actions button:disabled {
      background: #cccccc;
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

    .login-link {
      margin-top: 1.5rem;
      text-align: center;
      color: #7f8c8d;
    }

    button[mat-icon-button] {
      color: #7f8c8d;
    }

    mat-spinner {
      margin-right: 8px;
    }

    @media (max-width: 480px) {
      .signup-container {
        padding: 1rem;
      }

      .signup-card {
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
export class SignupComponent {
  hidePassword = true;
  signupError = false;
  errorMessage = '';
  isLoading = false;
  
  signupForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern('^[a-zA-Z ]*$')
    ]],
    username: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9_]*$')
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `${this.getFieldLabel(controlName)} must be at least ${minLength} characters`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.getError('maxlength').requiredLength;
      return `${this.getFieldLabel(controlName)} must not exceed ${maxLength} characters`;
    }
    if (control.hasError('pattern')) {
      return this.getPatternErrorMessage(controlName);
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  private getFieldLabel(controlName: string): string {
    switch (controlName) {
      case 'name': return 'Full name';
      case 'username': return 'Username';
      case 'email': return 'Email';
      case 'password': return 'Password';
      default: return controlName;
    }
  }

  private getPatternErrorMessage(controlName: string): string {
    switch (controlName) {
      case 'name':
        return 'Name can only contain letters and spaces';
      case 'username':
        return 'Username can only contain letters, numbers, and underscores';
      case 'password':
        return 'Password must contain at least one letter and one number';
      default:
        return 'Invalid format';
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.signupError = false;
      
      const user = {
        username: this.signupForm.value.username!,
        password: this.signupForm.value.password!,
        email: this.signupForm.value.email!,
        name: this.signupForm.value.name!,
        favorites: []
      };

      const result = this.authService.signup(user);
      
      if (result.success) {
        this.router.navigate(['/recipes']);
      } else {
        this.signupError = true;
        this.errorMessage = result.error?.message || 'An error occurred during signup.';
      }
      
      this.isLoading = false;
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      
      this.signupError = true;
      this.errorMessage = 'Please fix the validation errors before submitting.';
    }
  }
}
