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
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="patientForm.invalid"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
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
  patientForm: FormGroup;
  isEditMode = false;
  patientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      gender: ['Male', Validators.required],
      bloodGroup: ['O+', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      condition: [''],
      status: ['Admitted'],
      admissionDate: [new Date().toISOString().split('T')[0], Validators.required],
      address: ['']
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
    this.patientService.getPatient(id).subscribe(patient => {
      if (patient) {
        this.patientForm.patchValue(patient);
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;

    const patient: Patient = this.patientForm.value;
    
    if (this.isEditMode && this.patientId) {
      patient.id = this.patientId;
      this.patientService.updatePatient(patient).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    } else {
      this.patientService.createPatient(patient).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }
} 