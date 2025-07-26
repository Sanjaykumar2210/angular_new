import { Routes } from '@angular/router';
import { PatientListComponent } from './patient-list.component';
import { PatientFormComponent } from './patient-form.component';

export const PATIENT_ROUTES: Routes = [
  { path: '', component: PatientListComponent },
  { path: 'add', component: PatientFormComponent },
  { path: 'edit/:id', component: PatientFormComponent }
]; 