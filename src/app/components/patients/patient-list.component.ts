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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let patient of patients" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-xl font-semibold text-gray-800">{{ patient.name }}</h2>
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

            <div *ngIf="patient.reports && patient.reports.length > 0" class="mt-4 pt-4 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-600 mb-2">Recent Reports</h3>
              <div class="space-y-2">
                <div *ngFor="let report of patient.reports.slice(0, 2)" class="text-sm">
                  <span class="text-gray-500">{{ report.date | date }}: </span>
                  <span class="text-gray-700">{{ report.type }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 flex space-x-3">
              <a [routerLink]="['edit', patient.id]" 
                 class="flex-1 text-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
                Edit
              </a>
              <button (click)="deletePatient(patient.id)" 
                      class="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
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

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
    this.loadStatistics();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe(patients => {
      this.patients = patients;
    });
  }

  loadStatistics() {
    this.patientService.getPatientStatistics().subscribe(stats => {
      this.statistics = stats;
    });
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

  deletePatient(id: number | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id).subscribe(() => {
        this.loadPatients();
        this.loadStatistics();
      });
    }
  }
} 