import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  savedRecipes: string[]; // Array of recipe IDs
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Load user from localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, email: string): void {
    const user: User = {
      id: this.generateUserId(),
      username,
      email,
      savedRecipes: []
    };
    this.setCurrentUser(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  saveRecipe(recipeId: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser && !currentUser.savedRecipes.includes(recipeId)) {
      currentUser.savedRecipes.push(recipeId);
      this.setCurrentUser(currentUser);
    }
  }

  removeSavedRecipe(recipeId: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.savedRecipes = currentUser.savedRecipes.filter(id => id !== recipeId);
      this.setCurrentUser(currentUser);
    }
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private generateUserId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 