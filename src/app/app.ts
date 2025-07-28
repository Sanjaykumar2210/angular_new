import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthModule } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, AuthModule],
  template: `
    <app-header></app-header>
    <main class="container mx-auto px-4 py-8">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
