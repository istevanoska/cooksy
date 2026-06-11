import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  recipes: any[] = [];
  filteredRecipes: any[] = [];
  trendingRecipes: any[] = [];
  currentUser:any;
  page = 0;
  hasMore = true;


  searchQuery: string = '';


  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  // ngOnInit() {
  //
  //   this.recipeService.getRecipes().subscribe((data: any[]) => {
  //
  //     this.recipes = data;
  //     this.filteredRecipes = data;
  //
  //
  //     this.trendingRecipes = [...data]
  //       .sort((a, b) => (b.calories || 0) - (a.calories || 0))
  //       .slice(0, 3);
  //
  //     if (typeof window !== 'undefined') {
  //
  //       this.currentUser = JSON.parse(
  //         localStorage.getItem('user') || 'null'
  //       );
  //
  //     }
  //
  //   });
  //
  // }
  ngOnInit() {

    this.searchQuery = '';
    this.page = 0;
    this.hasMore = true;

    this.loadRecipes();
  }
  filterRecipes() {

    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.filteredRecipes = this.recipes;
      return;
    }

    this.filteredRecipes = this.recipes.filter(recipe => {

      const name = recipe.name || '';
      const description = recipe.description || '';

      return (
        name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      );
    });
  }
  logout(){

    localStorage.removeItem('user');

    window.location.reload();
  }
  searchRecipes(){

    this.page = 0;

    this.recipeService
      .searchRecipes(this.searchQuery, this.page)
      .subscribe((data:any) => {

        console.log("SEARCH RESULT", data);

        this.filteredRecipes = data.content;
        this.hasMore = !data.last;
        console.log(data);
      });

  }
  loadMore(){

    this.page++;

    this.recipeService
      .searchRecipes(this.searchQuery, this.page)
      .subscribe((data:any) => {

        this.filteredRecipes = [
          ...this.filteredRecipes,
          ...data.content
        ];

        this.hasMore = !data.last;

      });
  }
  loadRecipes() {

    this.recipeService.getRecipes()
      .subscribe(data => {

        this.recipes = data;
        this.filteredRecipes = data;

      });

    this.recipeService.getTrendingRecipes()
      .subscribe(data => {

        this.trendingRecipes = data;

        console.log("TRENDING", data);

      });
  }
  goToSearch() {

    this.router.navigate(
      ['/recipes'],
      {
        queryParams: {
          q: this.searchQuery
        }
      }
    );

  }

}
