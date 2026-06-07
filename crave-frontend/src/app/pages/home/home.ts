import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';

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


  searchQuery: string = '';

  constructor(private recipeService: RecipeService){}

  ngOnInit() {

    this.recipeService.getRecipes().subscribe((data: any[]) => {

      this.recipes = data;
      this.filteredRecipes = data;


      this.trendingRecipes = [...data]
        .sort((a, b) => (b.calories || 0) - (a.calories || 0))
        .slice(0, 3);

      if (typeof window !== 'undefined') {

        this.currentUser = JSON.parse(
          localStorage.getItem('user') || 'null'
        );

      }

    });

  }

  filterRecipes() {

    this.filteredRecipes = this.recipes.filter(r =>
      r.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

  }
  logout(){

    localStorage.removeItem('user');

    window.location.reload();
  }

}
