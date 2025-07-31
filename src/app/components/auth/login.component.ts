import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
      <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 class="mb-6 text-center text-2xl font-bold text-gray-900">Welcome to Healthcare App</h2>
        <p class="mb-6 text-center text-gray-600">Please sign in to access your dashboard</p>
        <div class="space-y-4">
          <button
            (click)="login()"
            class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Login with Auth0
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    // Redirect to dashboard if already authenticated
    this.auth.isAuthenticated$.pipe(
      takeUntilDestroyed()
    ).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnInit(): void {
    // Additional initialization if needed
  }

  login(): void {
    this.auth.login();
  }
} 