import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

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
  loading = true;
  currentUser:any;

  constructor(
    private recipeService: RecipeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    if (typeof window === 'undefined') {
      return;
    }

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    this.currentUser = user;

    console.log("USER", user);

    this.recipeService
      .getFavoriteRecipes(user.id)
      .subscribe({
        next: (data) => {

          this.recipes = data;
          this.loading = false;

          this.cdr.detectChanges();
        },
        error: (err) => {

          console.error(err);
          this.loading = false;

        }
      });
  }
  logout(){

    localStorage.removeItem('user');

    window.location.reload();

  }
  removeFavorite(recipeId:number){

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    console.log("REMOVE", recipeId, user.id);

    this.recipeService
      .removeFavorite(recipeId, user.id)
      .subscribe({
        next: () => {

          console.log("REMOVED!");

          this.recipes =
            this.recipes.filter(
              r => r.id !== recipeId
            );

        },
        error: err => {
          console.error("DELETE ERROR", err);
        }
      });
  }
}
