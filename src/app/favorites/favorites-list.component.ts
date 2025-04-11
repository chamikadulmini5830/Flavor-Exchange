import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Recipe } from '../core/models';
import { RecipeService } from '../recipes/recipe.service';
import { FavoriteService } from './favorite.service';


@Component({
  selector: 'app-favorites-list',
  template: `
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">My Favorite Recipes</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <mat-card 
        *ngFor="let recipe of favoriteRecipes" 
        class="bg-white hover:shadow-xl transition-all duration-300"
      >
        <img 
          mat-card-image 
          [src]="recipe.imageUrl" 
          [alt]="recipe.title"
          class="h-48 w-full object-cover"
        >
        <mat-card-content class="p-4">
          <mat-card-title class="text-xl font-semibold text-gray-800 mb-4">{{ recipe.title }}</mat-card-title>
          <div class="flex flex-col space-y-4">
            <div class="flex items-center">
              <mat-icon class="text-yellow-500 mr-2">schedule</mat-icon>
              <span class="text-gray-600">{{ recipe.cookingTime }} mins</span>
            </div>
            <div class="flex items-center">
              <mat-icon class="text-yellow-500 mr-2">star</mat-icon>
              <span class="text-gray-600">{{ recipe.rating }}</span>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions class="flex justify-center p-4">
          <button 
            mat-raised-button 
            color="primary" 
            [routerLink]="['/recipe', recipe.id]"
          >
            View Details
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
    <div *ngIf="favoriteRecipes.length === 0" class="text-center py-12">
      <mat-icon class="text-6xl text-gray-400 mb-4">favorite_border</mat-icon>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No Favorite Recipes Yet</h3>
      <p class="text-gray-500">Start adding recipes to your favorites to see them here!</p>
    </div>
  </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .container h2 {
      text-align: center;
    }

    mat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s ease;
      border: 1px solid #e5e7eb;
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    mat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-color: #d1d5db;
    }

    mat-card-image {
      object-fit: cover;
      height: 200px;
      border-bottom: 1px solid #e5e7eb;
    }

    mat-card-content {
      flex: 1;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
    }

    mat-card-title {
      margin: 0;
      padding: 0;
      font-size: 1.25rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .flex-col {
      display: flex;
      flex-direction: column;
    }

    .space-y-4 > * + * {
      margin-top: 1rem;
    }

    .flex.items-center {
      display: flex;
      align-items: center;
    }

    mat-card-actions {
      margin-top: auto;
      padding: 1rem;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .text-6xl {
      font-size: 3.75rem;
    }

    mat-icon {
      vertical-align: middle;
    }
  `]
})
export class FavoritesListComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit(): void {
    this.loadFavoriteRecipes();
  }

  private loadFavoriteRecipes() {
    this.favoriteService.favorites$.subscribe(favoriteIds => {
      if (favoriteIds.length === 0) {
        this.favoriteRecipes = [];
        return;
      }
      
      this.recipeService.getRecipes().subscribe(recipes => {
        this.favoriteRecipes = recipes.filter(recipe => favoriteIds.includes(recipe.id));
      });
    });
  }
} 