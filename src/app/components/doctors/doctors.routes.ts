import { Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list.component';
import { DoctorFormComponent } from './doctor-form.component';

export const DOCTOR_ROUTES: Routes = [
  { path: '', component: DoctorListComponent },
  { path: 'add', component: DoctorFormComponent },
  { path: 'edit/:id', component: DoctorFormComponent }
]; 