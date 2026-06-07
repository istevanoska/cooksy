import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { RecipeDetails } from './pages/recipe-details/recipe-details';
import { Login } from './pages/login/login';

export const routes: Routes = [

  {
    path:'',
    component:Home
  },

  {
    path:'login',
    component:Login
  },

  {
    path:'recipe/:id',
    component:RecipeDetails
  },

  {
    path:'favorites',
    loadComponent:() =>
      import('./pages/favorites/favorites')
        .then(m => m.Favorites)
  }

];
