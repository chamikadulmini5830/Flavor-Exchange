import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: number[] = [];
  private favoritesSubject = new BehaviorSubject<number[]>(this.favorites);

  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    // Load favorites from localStorage on service initialization
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
      this.favoritesSubject.next(this.favorites);
    }
  }

  addFavorite(recipeId: number) {
    if (!this.favorites.includes(recipeId)) {
      this.favorites.push(recipeId);
      this.favoritesSubject.next(this.favorites);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  }

  removeFavorite(recipeId: number) {
    this.favorites = this.favorites.filter(id => id !== recipeId);
    this.favoritesSubject.next(this.favorites);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  isFavorite(recipeId: number): boolean {
    return this.favorites.includes(recipeId);
  }
}
