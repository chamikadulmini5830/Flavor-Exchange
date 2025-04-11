import { Injectable } from '@angular/core';

export interface Substitution {
  ingredient: string;
  alternatives: {
    option: string;
    ratio: string;
    notes?: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class SubstitutionsService {
  private substitutions: Substitution[] = [
    {
      ingredient: 'milk',
      alternatives: [
        { 
          option: 'almond milk', 
          ratio: '1:1',
          notes: 'Best for sweet recipes' 
        },
        { 
          option: 'soy milk', 
          ratio: '1:1',
          notes: 'Good for both sweet and savory dishes' 
        },
        { 
          option: 'oat milk', 
          ratio: '1:1',
          notes: 'Creamy texture, great for baking' 
        }
      ]
    },
    {
      ingredient: 'butter',
      alternatives: [
        { 
          option: 'coconut oil', 
          ratio: '1:1',
          notes: 'Best for baking' 
        },
        { 
          option: 'olive oil', 
          ratio: '3:4',
          notes: 'Better for savory dishes' 
        },
        { 
          option: 'applesauce', 
          ratio: '1:1',
          notes: 'For baking, reduces fat content' 
        }
      ]
    },
    {
      ingredient: 'eggs',
      alternatives: [
        { 
          option: 'flax eggs', 
          ratio: '1 tbsp ground flax + 3 tbsp water = 1 egg',
          notes: 'Let sit for 5 minutes before using' 
        },
        { 
          option: 'mashed banana', 
          ratio: '1/4 cup = 1 egg',
          notes: 'Best for sweet recipes' 
        },
        { 
          option: 'silken tofu', 
          ratio: '1/4 cup blended = 1 egg',
          notes: 'Good for dense baked goods' 
        }
      ]
    },
    {
      ingredient: 'sugar',
      alternatives: [
        { 
          option: 'honey', 
          ratio: '2:3',
          notes: 'Reduce liquid in recipe by 1/4 cup per cup of honey' 
        },
        { 
          option: 'maple syrup', 
          ratio: '2:3',
          notes: 'Reduce liquid in recipe by 3 tbsp per cup' 
        },
        { 
          option: 'stevia', 
          ratio: '1 tsp stevia = 1 cup sugar',
          notes: 'May need to add bulk with applesauce or mashed banana' 
        }
      ]
    }
  ];

  constructor() { }

  findSubstitutions(ingredient: string): Substitution | undefined {
    return this.substitutions.find(s => 
      s.ingredient.toLowerCase() === ingredient.toLowerCase()
    );
  }

  getAllSubstitutions(): Substitution[] {
    return this.substitutions;
  }

  addSubstitution(substitution: Substitution): void {
    if (!this.substitutions.some(s => s.ingredient === substitution.ingredient)) {
      this.substitutions.push(substitution);
    }
  }
} 