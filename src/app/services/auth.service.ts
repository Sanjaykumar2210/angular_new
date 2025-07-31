import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth0: Auth0Service,
    private router: Router
  ) {}

  // Check if user is authenticated
  get isAuthenticated$(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  // Get user profile
  get user$(): Observable<any> {
    return this.auth0.user$;
  }

  // Login
  login(): void {
    this.auth0.loginWithRedirect();
  }

  // Logout
  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin + '/login'
      }
    });
  }

  // Handle authentication state changes
  handleAuthStateChange(): Observable<boolean> {
    return this.auth0.isAuthenticated$.pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
} 