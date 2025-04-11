import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../core/models';
import { RecipeService } from './recipe.service';
import { AuthService } from '../auth/auth.service';
import { FavoriteService } from '../favorites/favorite.service';
import { TimerComponent } from '../components/timer/timer.component';
import { SubstitutionsComponent } from '../components/substitutions/substitutions.component';

@Component({
  selector: 'app-recipe-detail',
  template: `
  <div *ngIf="recipe" class="container mx-auto px-4 py-8">
    <mat-card class="max-w-4xl mx-auto">
      <img 
        mat-card-image 
        [src]="recipe.imageUrl" 
        alt="{{ recipe.title }}"
        class="w-full h-96 object-cover"
      >
      <mat-card-content class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="w-full">
            <mat-card-title class="text-3xl font-bold text-gray-800 mb-2">{{ recipe.title }}</mat-card-title>
            <mat-card-subtitle class="text-gray-600 w-full">
              <div class="info-list">
                <div class="info-row">
                  <div class="info-left">
                    <mat-icon class="text-yellow-500">schedule</mat-icon>
                    <span>Cooking Time</span>
                  </div>
                  <div class="info-right">{{ recipe.cookingTime }} mins</div>
                  <app-timer [cookingTime]="recipe.cookingTime"></app-timer>
                </div>
                <div class="info-row">
                  <div class="info-left">
                    <mat-icon class="text-yellow-500">star</mat-icon>
                    <span>Rating</span>
                  </div>
                  <div class="info-right">{{ recipe.rating }}</div>
                </div>
                <div class="info-row">
                  <div class="info-left">
                    <mat-icon class="text-gray-500">person</mat-icon>
                    <span>Author</span>
                  </div>
                  <div class="info-right">{{ recipe.author }}</div>
                </div>
              </div>
            </mat-card-subtitle>
          </div>
        </div>

        <div class="space-y-6">
          <mat-expansion-panel class="bg-gray-50">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <h3 class="text-xl font-semibold text-gray-800">Ingredients</h3>
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p class="text-gray-700 whitespace-pre-line">{{ recipe.ingredients }}</p>
            <app-substitutions [ingredients]="recipe.ingredients"></app-substitutions>
          </mat-expansion-panel>

          <mat-expansion-panel class="bg-gray-50">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <h3 class="text-xl font-semibold text-gray-800">Instructions</h3>
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p class="text-gray-700 whitespace-pre-line">{{ recipe.instructions }}</p>
          </mat-expansion-panel>
        </div>
      </mat-card-content>

      <mat-card-actions class="flex justify-end space-x-4 p-6">
        <button 
          mat-stroked-button 
          (click)="toggleFavorite()"
          [color]="isFavorite ? 'warn' : 'primary'"
          class="flex items-center"
        >
          <mat-icon class="mr-2">{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
          {{ isFavorite ? 'Remove from Favorites' : 'Save to Favorites' }}
        </button>
        <button 
          mat-raised-button 
          *ngIf="canEdit()" 
          [routerLink]="['/edit-recipe', recipe.id]"
          color="primary"
        >
          Edit Recipe
        </button>
        <button 
          mat-raised-button 
          *ngIf="canEdit()" 
          (click)="deleteRecipe()"
          color="warn"
        >
          Delete Recipe
        </button>
      </mat-card-actions>
    </mat-card>
  </div>
  <ng-template #loading>
    <div class="loading">
      <mat-spinner></mat-spinner>
    </div>
  </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .container {
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    mat-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    mat-card-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 8px 8px 0 0;
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }

    .info-row {
      display: grid;
      grid-template-columns: minmax(200px, auto) 1fr;
      align-items: center;
      padding: 8px 16px;
      background-color: #f8f9fa;
      border-radius: 6px;
      min-height: 48px;
      gap: 24px;
    }

    .info-left {
      display: flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
    }

    .info-left mat-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .info-left span {
      font-weight: 500;
      color: #4b5563;
      font-size: 0.95rem;
    }

    .info-right {
      font-weight: 600;
      color: #1f2937;
      text-align: right;
      font-size: 0.95rem;
    }

    .text-yellow-500 {
      color: #f59e0b;
    }

    .text-gray-500 {
      color: #6b7280;
    }

    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }

    mat-expansion-panel {
      background-color: #f9fafb;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    ::ng-deep .mat-expansion-panel-header {
      padding: 1.5rem;
    }

    ::ng-deep .mat-expansion-panel-body {
      padding: 0 1.5rem 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    p {
      color: #4a4a4a;
      line-height: 1.6;
      white-space: pre-line;
    }

    mat-card-actions {
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    button:hover {
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      mat-card-image {
        height: 300px;
      }

      .info-row {
       padding: 8px  12px;
      }

      .info-left {
        gap: 8px;
      }

      mat-card-actions {
        flex-direction: column;
        gap: 0.5rem;
      }

      button {
        width: 100%;
      }
    }

    .error-message {
      background-color: #fee2e2;
      color: #dc2626;
      padding: 1rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
  `]
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  isFavorite: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.recipeService.getRecipe(id).subscribe({
      next: recipe => {
        if (recipe) {
          this.recipe = recipe;
          this.isFavorite = this.favoriteService.isFavorite(recipe.id);
        } else {
          this.error = 'Recipe not found';
        }
        this.isLoading = false;
      },
      error: err => {
        this.error = 'Failed to load recipe. Please try again later.';
        this.isLoading = false;
        console.error('Error loading recipe:', err);
      }
    });
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.favoriteService.removeFavorite(this.recipe.id);
    } else {
      this.favoriteService.addFavorite(this.recipe.id);
    }
    this.isFavorite = !this.isFavorite;
  }

  canEdit(): boolean {
    const user = this.authService.getCurrentUser();
    return user && user.username === this.recipe.author;
  }

  deleteRecipe() {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.isLoading = true;
      this.recipeService.deleteRecipe(this.recipe.id).subscribe({
        next: success => {
          if (success) {
            this.router.navigate(['/recipes']);
          } else {
            this.error = 'Failed to delete recipe';
            this.isLoading = false;
          }
        },
        error: err => {
          this.error = 'Failed to delete recipe. Please try again later.';
          this.isLoading = false;
          console.error('Error deleting recipe:', err);
        }
      });
    }
  }
}
