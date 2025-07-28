import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Appointments</h1>
        <a routerLink="add" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New Appointment
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

      <!-- Appointment Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Total Appointments</h3>
          <p class="text-2xl font-semibold">{{ appointments.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Today's Appointments</h3>
          <p class="text-2xl font-semibold text-blue-600">{{ todayAppointments.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Completed</h3>
          <p class="text-2xl font-semibold text-green-600">{{ completedAppointments.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Upcoming</h3>
          <p class="text-2xl font-semibold text-yellow-600">{{ upcomingAppointments.length }}</p>
        </div>
      </div>

      <!-- Today's Appointments -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Today's Appointments</h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let appointment of todayAppointments" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ appointment.appointmentTime }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ appointment.name }}</div>
                    <div class="text-sm text-gray-500">Visit #{{ appointment.appointmentNo }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ appointment.mobileNo }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(appointment)">
                      {{ appointment.isDone ? 'Completed' : 'Pending' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ appointment.naration }}</td>
                </tr>
                <tr *ngIf="todayAppointments.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">No appointments for today</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let appointment of upcomingAppointments" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ appointment.appointmentDate | date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ appointment.appointmentTime }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ appointment.name }}</div>
                    <div class="text-sm text-gray-500">Visit #{{ appointment.appointmentNo }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ appointment.mobileNo }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ appointment.naration }}</td>
                </tr>
                <tr *ngIf="upcomingAppointments.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">No upcoming appointments</td>
                </tr>
              </tbody>
            </table>
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
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  todayAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  loading = false;
  error: string | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  get completedAppointments(): Appointment[] {
    return this.appointments.filter(a => a.isDone);
  }

  loadAppointments() {
    this.loading = true;
    this.error = null;

    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loadTodayAppointments();
        this.loadUpcomingAppointments();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load appointments. Please try again later.';
        this.loading = false;
        console.error('Error loading appointments:', err);
      }
    });
  }

  loadTodayAppointments() {
    this.appointmentService.getTodaysAppointments().subscribe({
      next: (appointments) => {
        this.todayAppointments = appointments;
      },
      error: (err) => {
        console.error('Error loading today\'s appointments:', err);
      }
    });
  }

  loadUpcomingAppointments() {
    this.appointmentService.getUpcomingAppointments().subscribe({
      next: (appointments) => {
        this.upcomingAppointments = appointments;
      },
      error: (err) => {
        console.error('Error loading upcoming appointments:', err);
      }
    });
  }

  getStatusClass(appointment: Appointment): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    return appointment.isDone
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-yellow-100 text-yellow-800`;
  }
} 