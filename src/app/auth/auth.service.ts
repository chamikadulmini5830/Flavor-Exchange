import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
  email: string;
  name: string;
  favorites: number[];
}

export interface AuthError {
  type: 'USERNAME_EXISTS' | 'EMAIL_EXISTS' | 'INVALID_CREDENTIALS' | 'VALIDATION_ERROR' | 'SYSTEM_ERROR';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'currentUser';
  private usersKey = 'users';

  constructor() {
    // Initialize with some default users if none exist
    if (!localStorage.getItem(this.usersKey)) {
      const defaultUsers = [
        {
          username: 'admin',
          password: 'admin123',
          email: 'admin@flavorexchange.com',
          name: 'Admin User',
          favorites: []
        }
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }
  }

  signup(user: User): { success: boolean; error?: AuthError } {
    try {
      const users = this.getUsers();
      
      // Validate username format
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(user.username)) {
        return {
          success: false,
          error: {
            type: 'VALIDATION_ERROR',
            message: 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores.'
          }
        };
      }

      // Check for existing username
      const usernameExists = users.find(u => u.username.toLowerCase() === user.username.toLowerCase());
      if (usernameExists) {
        return {
          success: false,
          error: {
            type: 'USERNAME_EXISTS',
            message: 'This username is already taken. Please choose another one.'
          }
        };
      }

      // Check for existing email
      const emailExists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (emailExists) {
        return {
          success: false,
          error: {
            type: 'EMAIL_EXISTS',
            message: 'This email is already registered. Please use another email or try logging in.'
          }
        };
      }

      // Validate password strength
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(user.password)) {
        return {
          success: false,
          error: {
            type: 'VALIDATION_ERROR',
            message: 'Password must be at least 6 characters long and contain both letters and numbers.'
          }
        };
      }

      users.push(user);
      localStorage.setItem(this.usersKey, JSON.stringify(users));
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'SYSTEM_ERROR',
          message: 'An unexpected error occurred. Please try again later.'
        }
      };
    }
  }

  login(username: string, password: string): { success: boolean; error?: AuthError } {
    try {
      const users = this.getUsers();
      const user = users.find(u => 
        (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) 
        && u.password === password
      );

      if (user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        return { success: true };
      }

      return {
        success: false,
        error: {
          type: 'INVALID_CREDENTIALS',
          message: 'Invalid username/email or password.'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'SYSTEM_ERROR',
          message: 'An unexpected error occurred. Please try again later.'
        }
      };
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(this.currentUserKey);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  isAuthenticated(): boolean {
    try {
      return !!localStorage.getItem(this.currentUserKey);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem(this.currentUserKey);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  private getUsers(): User[] {
    try {
      const users = localStorage.getItem(this.usersKey);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  updateCurrentUser(user: User): { success: boolean; error?: AuthError } {
    try {
      const users = this.getUsers();
      const index = users.findIndex(u => u.username === user.username);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        return { success: true };
      }
      return {
        success: false,
        error: {
          type: 'SYSTEM_ERROR',
          message: 'Failed to update user information.'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'SYSTEM_ERROR',
          message: 'An unexpected error occurred while updating user information.'
        }
      };
    }
  }
}
