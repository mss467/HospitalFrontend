import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        if (response.message === 'Login successful!') {
          this.successMessage = 'Login successful!';

          if (response.role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else if (response.role === 'DOCTOR') {
            this.router.navigate(['/doctor-dashboard']);
          } else if (response.role === 'PATIENT') {
            this.router.navigate(['/patient-dashboard']);
          } else {
            this.errorMessage = 'Invalid user role!';
          }
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (_err: any) => {
        this.errorMessage = 'Invalid username or password';
      },
    });
  }

  register(): void {
    this.authService.register(this.username, this.password, 'PATIENT').subscribe({
      next: (response: any) => {
        if (response.message === 'User registered successfully!') {
          this.successMessage = 'User registered successfully!';
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
      },
      error: (_err: any) => {
        this.errorMessage = 'Registration failed';
      },
    });
  }
}

export class Login {}
