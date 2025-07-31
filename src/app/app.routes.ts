import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'appointments',
    loadChildren: () => import('./components/appointments/appointments.routes').then(m => m.APPOINTMENT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'patients',
    loadChildren: () => import('./components/patients/patients.routes').then(m => m.PATIENT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'doctors',
    loadChildren: () => import('./components/doctors/doctors.routes').then(m => m.DOCTOR_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
