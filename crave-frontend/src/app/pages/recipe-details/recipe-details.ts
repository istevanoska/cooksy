import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recipe-details.html',
  styleUrls: ['./recipe-details.css']
})
export class RecipeDetails {

  recipe: any = null;

  reviews: any[] = [];

  ingredients: string[] = [];

  reviewComment = '';

  reviewRating = 5;

  isFavorite = false;

  loading = true;
  currentUser:any;


  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      this.loadRecipe(id);

    });
  }

  loadRecipe(id: number) {

    console.log("LOAD RECIPE", id);

    this.recipeService
      .getRecipeById(id)
      .subscribe({
        next: (data) => {

          console.log("RECIPE DATA", data);

          this.recipe = data;

        },
        error: (err) => {
          console.error("RECIPE ERROR", err);
        }
      });
  }
  loadReviews(recipeId: number) {

    this.recipeService
      .getRecipeReviews(recipeId)
      .subscribe({
        next: (data) => {
          this.reviews = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  submitReview() {

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    this.recipeService
      .addReview(
        this.recipe.id,
        {
          userId: user.id,
          rating: this.reviewRating,
          comment: this.reviewComment
        }
      )
      .subscribe({
        next: () => {

          this.reviewComment = '';
          this.reviewRating = 5;

          this.loadReviews(this.recipe.id);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  saveRecipe() {

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    this.recipeService
      .addFavorite(
        this.recipe.id,
        user.id
      )
      .subscribe({
        next: () => {

          this.isFavorite = true;

          alert('Recipe saved ❤️');
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
  logout(){

    localStorage.removeItem('user');

    window.location.reload();
  }
}
