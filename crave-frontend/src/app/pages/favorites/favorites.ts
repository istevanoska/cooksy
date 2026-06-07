import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites {

  recipes:any[] = [];

  constructor(
    private recipeService: RecipeService
  ) {}

  ngOnInit(){

    if (typeof window === 'undefined') {
      return;
    }

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    console.log("USER", user);

    this.recipeService
      .getFavoriteRecipes(user.id)
      .subscribe({
        next: (data) => {

          console.log("FAVORITES", data);

          this.recipes = data;

        },
        error: (err) => {

          console.error("FAVORITES ERROR", err);

        }
      });
  }
}
