import { Injectable } from '@angular/core';
import { Recipe } from '../core/models';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'assets/mock-recipes.json';
  // Local recipes array to simulate added recipes
  private localRecipes: Recipe[] = [];

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      delay(500),
      map(apiRecipes => {
        const storedRecipes = localStorage.getItem('recipes');
        let localRecipes: Recipe[] = [];
        
        if (storedRecipes) {
          try {
            localRecipes = JSON.parse(storedRecipes);
          } catch (error) {
            console.error('Error parsing stored recipes:', error);
            localRecipes = [];
          }
        }
        
        return [...apiRecipes, ...localRecipes];
      }),
      catchError(err => {
        console.error('Error fetching recipes:', err);
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
          try {
            return of(JSON.parse(storedRecipes));
          } catch (error) {
            console.error('Error parsing stored recipes:', error);
            return of([]);
          }
        }
        return of([]);
      })
    );
  }

  getRecipe(id: number): Observable<Recipe | undefined> {
    return this.getRecipes().pipe(
      map((recipes: Recipe[]) => recipes.find(recipe => recipe.id === id)),
      catchError(err => {
        console.error('Error fetching recipe:', err);
        return throwError(() => new Error('Failed to fetch recipe'));
      })
    );
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    try {
      recipe.id = new Date().getTime();
      
      const storedRecipes = localStorage.getItem('recipes');
      let recipes: Recipe[] = [];
      
      if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
      }
      
      recipes.push(recipe);
      localStorage.setItem('recipes', JSON.stringify(recipes));
      this.localRecipes.push(recipe);
      
      return of(recipe);
    } catch (error) {
      console.error('Error adding recipe:', error);
      return throwError(() => new Error('Failed to add recipe'));
    }
  }

  updateRecipe(updatedRecipe: Recipe): Observable<Recipe> {
    try {
      const index = this.localRecipes.findIndex(r => r.id === updatedRecipe.id);
      if (index !== -1) {
        this.localRecipes[index] = updatedRecipe;
        localStorage.setItem('recipes', JSON.stringify(this.localRecipes));
        return of(updatedRecipe);
      }
      this.localRecipes.push(updatedRecipe);
      localStorage.setItem('recipes', JSON.stringify(this.localRecipes));
      return of(updatedRecipe);
    } catch (error) {
      console.error('Error updating recipe:', error);
      return throwError(() => new Error('Failed to update recipe'));
    }
  }

  deleteRecipe(id: number): Observable<boolean> {
    try {
      const index = this.localRecipes.findIndex(r => r.id === id);
      if (index !== -1) {
        this.localRecipes.splice(index, 1);
        localStorage.setItem('recipes', JSON.stringify(this.localRecipes));
        return of(true);
      }
      return of(false);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return throwError(() => new Error('Failed to delete recipe'));
    }
  }
}
