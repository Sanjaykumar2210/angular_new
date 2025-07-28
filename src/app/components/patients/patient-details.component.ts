import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Patient Details</h2>
          <button routerLink="/patients" class="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200">
            Back to List
          </button>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading patient details...</p>
        </div>

        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div *ngIf="patient && !loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm text-gray-500">Name</h3>
              <p class="text-lg font-medium">{{ patient.name }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm text-gray-500">Age</h3>
              <p class="text-lg font-medium">{{ patient.age }} years</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm text-gray-500">Gender</h3>
              <p class="text-lg font-medium">{{ patient.gender }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm text-gray-500">Contact Number</h3>
              <p class="text-lg font-medium">{{ patient.contactNumber }}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm text-gray-500">Address</h3>
              <p class="text-lg font-medium">{{ patient.address }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm text-gray-500">Status</h3>
              <p class="text-lg font-medium">
                <span [class]="getStatusClass()">{{ patient.status }}</span>
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm text-gray-500">Admission Date</h3>
              <p class="text-lg font-medium">{{ patient.admissionDate | date }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm text-gray-500">Blood Group</h3>
              <p class="text-lg font-medium">{{ patient.bloodGroup }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="!patient && !loading && !error" class="text-center py-8">
          <p class="text-gray-600">No patient found with the specified ID.</p>
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
export class PatientDetailsComponent implements OnInit {
  patient: Patient | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadPatient(+id);
    }
  }

  loadPatient(id: number) {
    this.loading = true;
    this.error = null;
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load patient details. Please try again later.';
        this.loading = false;
        console.error('Error loading patient:', err);
      }
    });
  }

  getStatusClass(): string {
    if (!this.patient) return '';
    
    const baseClass = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (this.patient.status) {
      case 'Admitted':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'Discharged':
        return `${baseClass} bg-gray-100 text-gray-800`;
      case 'Under Treatment':
        return `${baseClass} bg-blue-100 text-blue-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }
} 