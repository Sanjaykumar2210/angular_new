import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Schedule New Appointment</h2>

        <!-- Error Alert -->
        <div *ngIf="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span class="block sm:inline">{{ error }}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3" (click)="error = null">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>

        <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Patient Information -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Patient Name</label>
              <input
                type="text"
                formControlName="name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': appointmentForm.get('name')?.invalid && appointmentForm.get('name')?.touched}"
              >
              <div *ngIf="appointmentForm.get('name')?.invalid && appointmentForm.get('name')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Name is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                formControlName="mobileNo"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': appointmentForm.get('mobileNo')?.invalid && appointmentForm.get('mobileNo')?.touched}"
              >
              <div *ngIf="appointmentForm.get('mobileNo')?.invalid && appointmentForm.get('mobileNo')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Mobile number is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                formControlName="age"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': appointmentForm.get('age')?.invalid && appointmentForm.get('age')?.touched}"
              >
              <div *ngIf="appointmentForm.get('age')?.invalid && appointmentForm.get('age')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Age is required
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
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                formControlName="city"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': appointmentForm.get('city')?.invalid && appointmentForm.get('city')?.touched}"
              >
              <div *ngIf="appointmentForm.get('city')?.invalid && appointmentForm.get('city')?.touched" 
                   class="text-red-500 text-sm mt-1">
                City is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">First Visit?</label>
              <div class="mt-1">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    formControlName="isFirstVisit"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                  <span class="ml-2">Yes, this is the first visit</span>
                </label>
              </div>
            </div>

            <!-- Appointment Details -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Appointment Date</label>
              <input
                type="date"
                formControlName="appointmentDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': appointmentForm.get('appointmentDate')?.invalid && appointmentForm.get('appointmentDate')?.touched}"
              >
              <div *ngIf="appointmentForm.get('appointmentDate')?.invalid && appointmentForm.get('appointmentDate')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Appointment date is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Appointment Time</label>
              <input
                type="time"
                formControlName="appointmentTime"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': appointmentForm.get('appointmentTime')?.invalid && appointmentForm.get('appointmentTime')?.touched}"
              >
              <div *ngIf="appointmentForm.get('appointmentTime')?.invalid && appointmentForm.get('appointmentTime')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Appointment time is required
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                formControlName="naration"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
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
              [disabled]="!appointmentForm.valid || loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              <span *ngIf="loading" class="mr-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              Schedule Appointment
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
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      mobileNo: ['', Validators.required],
      city: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['Male', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      isFirstVisit: [false],
      naration: ['']
    });
  }

  ngOnInit(): void {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.appointmentForm.patchValue({
      appointmentDate: tomorrow.toISOString().split('T')[0]
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid || this.loading) return;

    this.loading = true;
    this.error = null;

    this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
      next: () => {
        this.router.navigate(['/appointments']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to create appointment. Please try again later.';
        this.loading = false;
        console.error('Error creating appointment:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/appointments']);
  }
} 