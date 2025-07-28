import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex flex-shrink-0 items-center">
              <a routerLink="/" class="text-xl font-bold text-gray-900">
                Healthcare App
              </a>
            </div>
            <div class="ml-6 flex space-x-8">
              <a
                routerLink="/dashboard"
                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Dashboard
              </a>
              <a
                routerLink="/doctors"
                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Doctors
              </a>
              <a
                routerLink="/patients"
                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Patients
              </a>
              <a
                routerLink="/appointments"
                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Appointments
              </a>
            </div>
          </div>
          <div class="flex items-center">
            <ng-container *ngIf="auth.isAuthenticated$ | async; else loginButton">
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-700">{{ (auth.user$ | async)?.name }}</span>
                <button
                  (click)="auth.logout()"
                  class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            </ng-container>
            <ng-template #loginButton>
              <button
                (click)="auth.login()"
                class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </button>
            </ng-template>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
} 