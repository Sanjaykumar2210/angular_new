import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./components/appointments/appointments.routes').then(m => m.APPOINTMENT_ROUTES)
  },
  {
    path: 'patients',
    loadChildren: () => import('./components/patients/patients.routes').then(m => m.PATIENT_ROUTES)
  },
  {
    path: 'doctors',
    loadChildren: () => import('./components/doctors/doctors.routes').then(m => m.DOCTOR_ROUTES)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
