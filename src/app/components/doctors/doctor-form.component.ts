import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ isEditMode ? 'Edit Doctor' : 'Add New Doctor' }}
        </h2>
        
        <form [formGroup]="doctorForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                formControlName="name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': doctorForm.get('name')?.invalid && doctorForm.get('name')?.touched}"
              >
              <div *ngIf="doctorForm.get('name')?.invalid && doctorForm.get('name')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Name is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Specialty</label>
              <input
                type="text"
                formControlName="specialty"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': doctorForm.get('specialty')?.invalid && doctorForm.get('specialty')?.touched}"
              >
              <div *ngIf="doctorForm.get('specialty')?.invalid && doctorForm.get('specialty')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Specialty is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                formControlName="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': doctorForm.get('email')?.invalid && doctorForm.get('email')?.touched}"
              >
              <div *ngIf="doctorForm.get('email')?.invalid && doctorForm.get('email')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Valid email is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                formControlName="phone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': doctorForm.get('phone')?.invalid && doctorForm.get('phone')?.touched}"
              >
              <div *ngIf="doctorForm.get('phone')?.invalid && doctorForm.get('phone')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Phone is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input
                type="number"
                formControlName="experience"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                [ngClass]="{'border-red-500': doctorForm.get('experience')?.invalid && doctorForm.get('experience')?.touched}"
              >
              <div *ngIf="doctorForm.get('experience')?.invalid && doctorForm.get('experience')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Experience is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Profile Image URL</label>
              <input
                type="text"
                formControlName="image"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Availability -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Availability</h3>
            <div formGroupName="availability" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Working Hours</label>
                <input
                  type="text"
                  formControlName="hours"
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Working Days</label>
                <input
                  type="text"
                  formControlName="days"
                  placeholder="e.g., Monday, Tuesday, Wednesday"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                <p class="text-sm text-gray-500 mt-1">Separate days with commas</p>
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
              [disabled]="doctorForm.invalid"
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
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  doctorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialty: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0)]],
      image: [''],
      availability: this.fb.group({
        hours: ['9:00 AM - 5:00 PM'],
        days: ['Monday, Tuesday, Wednesday, Thursday, Friday']
      })
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.doctorId = +id;
      this.loadDoctor(this.doctorId);
    }
  }

  loadDoctor(id: number): void {
    this.doctorService.getDoctor(id).subscribe(doctor => {
      if (doctor) {
        // Convert days array to comma-separated string for form
        const daysString = doctor.availability.days.join(', ');
        this.doctorForm.patchValue({
          ...doctor,
          availability: {
            ...doctor.availability,
            days: daysString
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) return;

    // Convert comma-separated days string back to array
    const formValue = this.doctorForm.value;
    const doctor: Doctor = {
      ...formValue,
      availability: {
        ...formValue.availability,
        days: formValue.availability.days.split(',').map((day: string) => day.trim())
      }
    };
    
    if (this.isEditMode && this.doctorId) {
      doctor.id = this.doctorId;
      this.doctorService.updateDoctor(doctor).subscribe(() => {
        this.router.navigate(['/doctors']);
      });
    } else {
      this.doctorService.addDoctor(doctor).subscribe(() => {
        this.router.navigate(['/doctors']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/doctors']);
  }
} 