import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(){

    this.authService
      .login(this.email,this.password)
      .subscribe({

        next:(user:any)=>{

          console.log("LOGIN RESPONSE", user);

          localStorage.setItem(
            'user',
            JSON.stringify(user)
          );

          console.log(
            "LOCAL STORAGE",
            JSON.parse(localStorage.getItem('user')!)
          );

          this.router.navigate(['/']);
        },

        error:()=>{
          alert('Wrong email or password');
        }
      });
  }
}
