import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Doctors Directory</h1>
        <a routerLink="add" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New Doctor
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let doctor of doctors" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="relative">
            <div class="absolute top-0 right-0 mt-4 mr-4">
              <span class="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                Available
              </span>
            </div>
          </div>
          
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ doctor.name }}</h2>
            <p class="text-gray-600 mb-4">{{ doctor.specialty }}</p>
            
            <div class="space-y-2">
              <div class="flex items-center text-gray-600">
                <span class="mr-2">📧</span>
                {{ doctor.email }}
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">📱</span>
                {{ doctor.phone }}
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">⭐</span>
                {{ (doctor.rating || 0).toFixed(1) }} / 5
              </div>
              <div class="flex items-center text-gray-600">
                <span class="mr-2">💼</span>
                {{ doctor.experience }} years experience
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-600 mb-2">Availability</h3>
              <div class="text-sm text-gray-500">
                <p>{{ doctor.availability.days.join(', ') }}</p>
                <p>{{ doctor.availability.hours }}</p>
              </div>
            </div>

            <div class="mt-6 flex space-x-3">
              <a [routerLink]="['edit', doctor.id]" 
                 class="flex-1 text-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
                Edit
              </a>
              <button (click)="deleteDoctor(doctor.id)" 
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
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    console.log('Loading doctors...');
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        console.log('Doctors loaded:', doctors);
        this.doctors = doctors;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
      }
    });
  }

  deleteDoctor(id: number | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe(() => {
        this.doctors = this.doctors.filter(d => d.id !== id);
      });
    }
  }
} 