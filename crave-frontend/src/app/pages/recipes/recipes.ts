import { Component } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SlicePipe
  ],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class Recipes {

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {}

  recipes:any[] = [];

  searchQuery = '';
  sortBy = 'name';
  maxCalories = 500;
  currentUser:any;


  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      this.searchQuery = params['q'] || '';

      this.searchRecipes();

    });

  }
  searchRecipes() {

    this.recipeService
      .searchRecipes(
        this.searchQuery,
        0
      )
      .subscribe((data:any) => {

        this.recipes = data.content;

      });

  }
  sortRecipes() {

    if(this.sortBy === 'calories'){

      this.recipes.sort(
        (a,b) => b.calories - a.calories
      );

    }

    if(this.sortBy === 'time'){

      this.recipes.sort(
        (a,b) => a.totalTime - b.totalTime
      );

    }

    if(this.sortBy === 'name'){

      this.recipes.sort(
        (a,b) => a.name.localeCompare(b.name)
      );

    }

  }
  applyFilters() {

    this.recipes = this.recipes.filter(
      r => r.calories <= this.maxCalories
    );

  }
  logout(){

    localStorage.removeItem('user');

    window.location.reload();
  }
}
