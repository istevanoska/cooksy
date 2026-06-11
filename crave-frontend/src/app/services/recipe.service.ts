import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  apiUrl = 'http://localhost:8080/api/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getRecipeById(id: number) {
    return this.http.get<any>(
      `http://localhost:8080/api/recipes/${id}`
    );
  }
  getRecipeReviews(id: number) {
    return this.http.get<any[]>(
      `http://localhost:8080/api/recipes/${id}/reviews`
    );
  }
  getRecipeIngredients(id: number) {
    return this.http.get<string[]>(
      `http://localhost:8080/api/recipes/${id}/ingredients`
    );
  }
  addReview(
    recipeId:number,
    review:any
  ){

    return this.http.post(
      `http://localhost:8080/api/recipes/${recipeId}/reviews`,
      review
    );
  }
  addFavorite(
    recipeId:number,
    userId:number
  ){
    return this.http.post(
      `http://localhost:8080/api/recipes/${recipeId}/favorite?userId=${userId}`,
      {}
    );
  }
  getFavoriteRecipes(userId:number){

    return this.http.get<any[]>(
      `http://localhost:8080/api/users/${userId}/favorites`
    );

  }
  searchRecipes(query: string, page: number){
    return this.http.get(
      `${this.apiUrl}/search?query=${query}&page=${page}`
    );
  }
  removeFavorite(
    recipeId:number,
    userId:number
  ){

    return this.http.delete(
      `http://localhost:8080/api/recipes/${recipeId}/favorite?userId=${userId}`
    );

  }
  getTrendingRecipes() {
    return this.http.get<any[]>(
      `${this.apiUrl}/trending`
    );
  }

}
