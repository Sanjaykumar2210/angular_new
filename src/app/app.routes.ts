import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppointmentListComponent } from './components/appointments/appointment-list.component';
import { AppointmentFormComponent } from './components/appointments/appointment-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { 
    path: 'doctors',
    loadChildren: () => import('./components/doctors/doctors.routes').then(m => m.DOCTOR_ROUTES)
  },
  { 
    path: 'patients',
    loadChildren: () => import('./components/patients/patients.routes').then(m => m.PATIENT_ROUTES)
  },
  { path: 'appointments', component: AppointmentListComponent },
  { path: 'appointments/new', component: AppointmentFormComponent },
  { path: '**', redirectTo: 'dashboard' }
];
