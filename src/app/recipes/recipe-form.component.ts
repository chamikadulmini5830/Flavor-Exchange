import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Recipe } from '../core/models';
import { RecipeService } from './recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-recipe-form',
  template: `
  <h2>{{ isEditMode ? 'Edit Recipe' : 'Add Recipe' }}</h2>
  <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()">
    <mat-form-field appearance="fill">
      <mat-label>Title</mat-label>
      <input matInput formControlName="title">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Ingredients</mat-label>
      <textarea matInput formControlName="ingredients"></textarea>
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Instructions</mat-label>
      <textarea matInput formControlName="instructions"></textarea>
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Cooking Time (in minutes)</mat-label>
      <input matInput type="number" formControlName="cookingTime">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Rating</mat-label>
      <input matInput type="number" formControlName="rating">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Image URL</mat-label>
      <input matInput formControlName="imageUrl">
    </mat-form-field>

    <button mat-raised-button color="primary" type="submit">{{ isEditMode ? 'Update' : 'Add' }} Recipe</button>
  </form>
  `,
  styles: [`
    form {
      max-width: 450px;
      margin: 1.5rem auto;
      padding: 1.5rem;
      border-radius: 12px;
      background: linear-gradient(145deg, #ffffff, #f8f9fa);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      transition: all 0.3s ease;
    }

    form:hover {
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    }

    h2 {
      text-align: center;
      font-size: 1.75rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      position: relative;
      letter-spacing: 0.5px;
    }

    h2::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
      border-radius: 4px;
    }

    /* Box-style Form Field Styling */
    mat-form-field {
      width: 100%;
      transition: all 0.3s ease;
      margin-bottom: 0.75rem;
      background: white;
      border-radius: 12px;
      padding: 0.25rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    mat-form-field:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    ::ng-deep .mat-form-field-wrapper {
      padding-bottom: 0;
    }

    ::ng-deep .mat-form-field-outline {
      display: none;
    }

    ::ng-deep .mat-form-field-flex {
      background: transparent;
      padding: 0;
    }

    ::ng-deep .mat-form-field-infix {
      border-top: none;
      padding: 0.5rem 0;
    }

    ::ng-deep .mat-form-field-label {
      color: #666;
      font-weight: 500;
      font-size: 0.9rem;
      transform: translateY(-1.2em) scale(0.75);
      background: white;
      padding: 0 0.5rem;
      margin-left: -0.5rem;
      text-align: center;
      width: 100%;
      left: 0;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
      color: #ff6b6b;
    }

    ::ng-deep .mat-input-element {
      color: #333;
      font-size: 1rem;
      padding: 0.75rem;
      line-height: 1.4;
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      transition: all 0.3s ease;
      text-align: center;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-input-element {
      border-color: #ff6b6b;
      box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
    }

    ::ng-deep .mat-form-field-ripple {
      display: none;
    }

    /* Hide required field star */
    ::ng-deep .mat-form-field-required-marker {
      display: none;
    }

    textarea {
      min-height: 100px;
      resize: vertical;
      line-height: 1.4;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      width: 100%;
      transition: all 0.3s ease;
      text-align: center;
    }

    textarea:focus {
      border-color: #ff6b6b;
      box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
      outline: none;
    }

    /* Number Input Styling */
    ::ng-deep input[type="number"]::-webkit-inner-spin-button,
    ::ng-deep input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    ::ng-deep input[type="number"] {
      -moz-appearance: textfield;
    }

    button[type="submit"] {
      margin-top: 1.5rem;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      align-self: center;
      background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
    }

    button[type="submit"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
    }

    button[type="submit"]:active {
      transform: translateY(-1px);
    }

    /* Error State Styling */
    ::ng-deep .mat-form-field-invalid .mat-input-element {
      border-color: #ff4444;
    }

    ::ng-deep .mat-error {
      color: #ff4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      padding: 0 0.75rem;
      text-align: center;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      form {
        margin: 1rem;
        padding: 1.25rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      button[type="submit"] {
        width: 100%;
        padding: 0.75rem 1.5rem;
        font-size: 0.9rem;
      }

      ::ng-deep .mat-form-field {
        font-size: 0.9rem;
      }

      textarea {
        min-height: 80px;
      }
    }
  `]
})
export class RecipeFormComponent implements OnInit {
  recipeForm = this.fb.group({
    title: ['', Validators.required],
    ingredients: ['', Validators.required],
    instructions: ['', Validators.required],
    cookingTime: [0, [Validators.required, Validators.min(1)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    imageUrl: ['', Validators.required]
  });
  isEditMode: boolean = false;
  recipeId!: number;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      this.isEditMode = true;
      this.recipeId = +this.route.snapshot.paramMap.get('id')!;
      this.recipeService.getRecipe(this.recipeId).subscribe(recipe => {
        if (recipe) {
          this.recipeForm.patchValue(recipe);
        }
      });
    }
  }

  onSubmit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    const formValue = this.recipeForm.value;
    const recipe: Recipe = {
      id: this.isEditMode ? this.recipeId : 0,
      title: formValue.title,
      ingredients: formValue.ingredients,
      instructions: formValue.instructions,
      cookingTime: formValue.cookingTime,
      rating: formValue.rating,
      imageUrl: formValue.imageUrl,
      author: currentUser.username
    };

    if (this.isEditMode) {
      this.recipeService.updateRecipe(recipe).subscribe(updated => {
        this.router.navigate(['/recipe', updated.id]);
      });
    } else {
      this.recipeService.addRecipe(recipe).subscribe(newRecipe => {
        this.router.navigate(['/recipe', newRecipe.id]);
      });
    }
  }
}
