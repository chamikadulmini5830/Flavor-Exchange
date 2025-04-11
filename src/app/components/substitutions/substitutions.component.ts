import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SubstitutionsService, Substitution } from '../../services/substitutions.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-substitutions',
  template: `
    <div class="substitutions-container">
      <h2>Ingredient Substitutions</h2>
      
      <mat-form-field appearance="fill" class="search-field">
        <mat-label>Search ingredients</mat-label>
        <input matInput [formControl]="searchControl" placeholder="Type an ingredient...">
      </mat-form-field>

      <div class="substitutions-list">
        <mat-accordion>
          <mat-expansion-panel *ngFor="let sub of filteredSubstitutions">
            <mat-expansion-panel-header>
              <mat-panel-title>
                {{ sub.ingredient | titlecase }}
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="alternatives-list">
              <mat-card *ngFor="let alt of sub.alternatives" class="alternative-card">
                <mat-card-header>
                  <mat-card-title>{{ alt.option | titlecase }}</mat-card-title>
                  <mat-card-subtitle>Ratio: {{ alt.ratio }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content *ngIf="alt.notes">
                  <p>{{ alt.notes }}</p>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </div>
    </div>
  `,
  styles: [`
    .substitutions-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .alternatives-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      padding: 16px 0;
    }

    .alternative-card {
      margin-bottom: 16px;
    }

    mat-card-content {
      padding: 16px;
    }

    h2 {
      margin-bottom: 24px;
      color: #333;
    }
  `]
})
export class SubstitutionsComponent implements OnInit {
  searchControl = new FormControl('');
  allSubstitutions: Substitution[] = [];
  filteredSubstitutions: Substitution[] = [];

  constructor(private substitutionsService: SubstitutionsService) {}

  ngOnInit() {
    this.allSubstitutions = this.substitutionsService.getAllSubstitutions();
    this.filteredSubstitutions = this.allSubstitutions;

    this.searchControl.valueChanges.subscribe(value => {
      this.filterSubstitutions(value || '');
    });
  }

  private filterSubstitutions(searchTerm: string) {
    if (!searchTerm) {
      this.filteredSubstitutions = this.allSubstitutions;
      return;
    }

    searchTerm = searchTerm.toLowerCase();
    this.filteredSubstitutions = this.allSubstitutions.filter(sub =>
      sub.ingredient.toLowerCase().includes(searchTerm) ||
      sub.alternatives.some(alt => 
        alt.option.toLowerCase().includes(searchTerm)
      )
    );
  }
} 