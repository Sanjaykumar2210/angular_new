import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ isEditMode ? 'Edit Patient' : 'Add New Patient' }}
        </h2>

        <div *ngIf="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span class="block sm:inline">{{ error }}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3" (click)="error = null">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
        
        <form [formGroup]="patientForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                formControlName="name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': patientForm.get('name')?.invalid && patientForm.get('name')?.touched}"
              >
              <div *ngIf="patientForm.get('name')?.invalid && patientForm.get('name')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Name is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                formControlName="age"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': patientForm.get('age')?.invalid && patientForm.get('age')?.touched}"
              >
              <div *ngIf="patientForm.get('age')?.invalid && patientForm.get('age')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Valid age is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <select
                formControlName="gender"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Blood Group</label>
              <select
                formControlName="bloodGroup"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                formControlName="contactNumber"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': patientForm.get('contactNumber')?.invalid && patientForm.get('contactNumber')?.touched}"
              >
              <div *ngIf="patientForm.get('contactNumber')?.invalid && patientForm.get('contactNumber')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Contact number is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                formControlName="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': patientForm.get('email')?.invalid && patientForm.get('email')?.touched}"
              >
              <div *ngIf="patientForm.get('email')?.invalid && patientForm.get('email')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Valid email is required
              </div>
            </div>
          </div>

          <!-- Medical Information -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Condition</label>
                <input
                  type="text"
                  formControlName="condition"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select
                  formControlName="status"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Under Treatment">Under Treatment</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Admission Date</label>
                <input
                  type="date"
                  formControlName="admissionDate"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  formControlName="address"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              [disabled]="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!patientForm.valid || loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              <span *ngIf="loading" class="mr-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup = this.initializeForm();
  isEditMode = false;
  patientId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private initializeForm(patient?: Patient): FormGroup {
    return this.fb.group({
      name: [patient?.name || '', [Validators.required]],
      age: [patient?.age || '', [Validators.required, Validators.min(0), Validators.max(150)]],
      gender: [patient?.gender || 'Male', [Validators.required]],
      bloodGroup: [patient?.bloodGroup || 'O+'],
      contactNumber: [patient?.contactNumber || '', [Validators.required]],
      email: [patient?.email || 'Not specified'],
      condition: [patient?.condition || 'Not specified'],
      status: [patient?.status || 'Admitted'],
      admissionDate: [patient?.admissionDate || new Date().toISOString().split('T')[0]],
      address: [patient?.address || '']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.patientId = +id;
      this.loadPatient(this.patientId);
    }
  }

  loadPatient(id: number): void {
    this.loading = true;
    this.error = null;
    this.patientService.getPatient(id).subscribe({
      next: (patient) => {
        if (patient) {
          // Reinitialize the form with patient data
          this.patientForm = this.initializeForm(patient);
        } else {
          this.error = 'Patient not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load patient details';
        this.loading = false;
        console.error('Error loading patient:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.patientForm.valid || this.loading) return;

    const formValue = this.patientForm.value;
    const patient: Patient = {
      ...formValue,
      id: this.isEditMode ? this.patientId : undefined
    };

    this.loading = true;
    this.error = null;
    
    if (this.isEditMode && this.patientId) {
      this.patientService.updatePatient(patient).subscribe({
        next: () => {
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          this.error = err.message || 'Failed to update patient';
          this.loading = false;
          console.error('Error updating patient:', err);
        }
      });
    } else {
      this.patientService.createPatient(patient).subscribe({
        next: () => {
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          this.error = err.message || 'Failed to create patient';
          this.loading = false;
          console.error('Error creating patient:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }
} 