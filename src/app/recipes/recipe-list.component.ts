import { Component, OnInit } from '@angular/core';
import { Recipe } from '../core/models';
import { RecipeService } from './recipe.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  template: `
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Discover Recipes</h2>
    <div class="flex justify-center mb-8">
      <mat-form-field appearance="outline" class="w-full max-w-md">
        <mat-label class="text-gray-600">Search Recipes</mat-label>
        <input 
          matInput 
          [formControl]="searchControl" 
          placeholder="Enter title or ingredient"
          class="text-gray-700"
        >
        <mat-icon matSuffix class="text-gray-400">search</mat-icon>
      </mat-form-field>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <mat-card 
        *ngFor="let recipe of filteredRecipes$ | async" 
        class="bg-white hover:shadow-xl transition-all duration-300"
      >
        <img 
          mat-card-image 
          [src]="recipe.imageUrl" 
          alt="{{recipe.title}}"
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
            class="bg-primary-600 hover:bg-primary-700 text-white"
          >
            View Details
          </button>
        </mat-card-actions>
      </mat-card>
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

    .grid {
      display: grid;
      gap: 1.5rem;
      padding: 1rem;
    }

    @media (min-width: 640px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1280px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `]
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  searchControl = new FormControl('');
  filteredRecipes$!: Observable<Recipe[]>;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes = data;
      this.setupFilter();
    });
  }

  setupFilter() {
    this.filteredRecipes$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(text => this.filterRecipes(text))
    );
  }

  filterRecipes(text: string): Recipe[] {
    if (!text) {
      return this.recipes;
    }
    const searchText = text.toLowerCase();
    return this.recipes.filter(recipe => {
      return recipe.title.toLowerCase().includes(searchText) ||
             recipe.ingredients.toLowerCase().includes(searchText);
    });
  }
}
