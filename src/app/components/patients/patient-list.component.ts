import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Patients Directory</h1>
        <a routerLink="add" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New Patient
        </a>
      </div>

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

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Total Patients</h3>
          <p class="text-2xl font-semibold">{{ statistics.total }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Admitted</h3>
          <p class="text-2xl font-semibold text-blue-600">{{ statistics.admitted }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Under Treatment</h3>
          <p class="text-2xl font-semibold text-yellow-600">{{ statistics.underTreatment }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Discharged</h3>
          <p class="text-2xl font-semibold text-green-600">{{ statistics.discharged }}</p>
        </div>
      </div>

      <!-- Patient List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let patient of patients" class="bg-white rounded-lg shadow-lg overflow-hidden relative">
          <!-- Loading Overlay -->
          <div *ngIf="isDeleting(patient.id)" class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>

          <div class="p-6" [class.opacity-50]="isDeleting(patient.id)">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-xl font-semibold text-gray-800">
                <a [routerLink]="[patient.id]" class="hover:text-blue-600">{{ patient.name }}</a>
              </h2>
              <span [class]="getStatusClass(patient.status)">
                {{ patient.status }}
              </span>
            </div>

            <div class="space-y-2">
              <div class="flex items-center text-gray-600">
                <span class="mr-2">👤</span>
                {{ patient.age }} years old, {{ patient.gender }}
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">🩺</span>
                {{ patient.condition }}
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">🏥</span>
                Admitted: {{ patient.admissionDate | date }}
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">🩸</span>
                Blood Group: {{ patient.bloodGroup }}
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">📱</span>
                {{ patient.contactNumber }}
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">📧</span>
                {{ patient.email }}
              </div>
            </div>

            <div class="mt-6 flex space-x-3">
              <a [routerLink]="[patient.id]" 
                 class="flex-1 text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                View Details
              </a>
              <a [routerLink]="['edit', patient.id]" 
                 class="flex-1 text-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
                Edit
              </a>
              <button (click)="deletePatient(patient.id)" 
                      [disabled]="isDeleting(patient.id)"
                      class="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  statistics = {
    total: 0,
    admitted: 0,
    discharged: 0,
    underTreatment: 0
  };
  loading = false;
  error: string | null = null;
  private deletingPatientIds: Set<number> = new Set();

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
    this.loadStatistics();
  }

  isDeleting(id: number | undefined): boolean {
    return id !== undefined && this.deletingPatientIds.has(id);
  }

  loadPatients() {
    this.loading = true;
    this.error = null;
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load patients. Please try again later.';
        this.loading = false;
        console.error('Error loading patients:', err);
      }
    });
  }

  loadStatistics() {
    this.patientService.getPatientStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
      }
    });
  }

  deletePatient(id: number | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this patient?')) {
      this.deletingPatientIds.add(id);
      this.error = null;

      this.patientService.deletePatient(id).subscribe({
        next: () => {
          this.deletingPatientIds.delete(id);
          this.loadPatients();
          this.loadStatistics();
        },
        error: (err) => {
          this.deletingPatientIds.delete(id);
          this.error = err.message || 'Failed to delete patient. Please try again later.';
          console.error('Error deleting patient:', err);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'Admitted':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Discharged':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Under Treatment':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }
} 