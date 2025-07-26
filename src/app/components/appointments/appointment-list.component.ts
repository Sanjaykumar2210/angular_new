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
        <a routerLink="/appointments/new" 
           class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          New Appointment
        </a>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Total</h3>
          <p class="text-2xl font-semibold">{{ statistics.total }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Pending</h3>
          <p class="text-2xl font-semibold text-yellow-600">{{ statistics.pending }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Confirmed</h3>
          <p class="text-2xl font-semibold text-blue-600">{{ statistics.confirmed }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Completed</h3>
          <p class="text-2xl font-semibold text-green-600">{{ statistics.completed }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-gray-500 text-sm">Cancelled</h3>
          <p class="text-2xl font-semibold text-red-600">{{ statistics.cancelled }}</p>
        </div>
      </div>

      <!-- Appointment List -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="min-w-full">
          <div class="bg-gray-50 border-b border-gray-200">
            <div class="grid grid-cols-7 gap-4 px-6 py-3">
              <div class="text-left text-xs font-medium text-gray-500 uppercase">Patient</div>
              <div class="text-left text-xs font-medium text-gray-500 uppercase">Doctor</div>
              <div class="text-left text-xs font-medium text-gray-500 uppercase">Department</div>
              <div class="text-left text-xs font-medium text-gray-500 uppercase">Date</div>
              <div class="text-left text-xs font-medium text-gray-500 uppercase">Time</div>
              <div class="text-left text-xs font-medium text-gray-500 uppercase">Status</div>
              <div class="text-right text-xs font-medium text-gray-500 uppercase">Actions</div>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            <div *ngFor="let appointment of appointments" class="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50">
              <div class="text-sm">
                <div class="font-medium text-gray-900">{{ appointment.patientName }}</div>
                <div class="text-gray-500">{{ appointment.patientEmail }}</div>
              </div>
              <div class="text-sm text-gray-900">{{ appointment.doctorName }}</div>
              <div class="text-sm text-gray-900">{{ appointment.department }}</div>
              <div class="text-sm text-gray-900">{{ appointment.appointmentDate | date }}</div>
              <div class="text-sm text-gray-900">{{ appointment.appointmentTime }}</div>
              <div class="text-sm">
                <span [class]="getStatusClass(appointment.status)">
                  {{ appointment.status }}
                </span>
              </div>
              <div class="text-right text-sm font-medium space-x-2">
                <button (click)="updateStatus(appointment, 'Confirmed')"
                        *ngIf="appointment.status === 'Pending'"
                        class="text-blue-600 hover:text-blue-900">
                  Confirm
                </button>
                <button (click)="updateStatus(appointment, 'Completed')"
                        *ngIf="appointment.status === 'Confirmed'"
                        class="text-green-600 hover:text-green-900">
                  Complete
                </button>
                <button (click)="updateStatus(appointment, 'Cancelled')"
                        *ngIf="appointment.status === 'Pending' || appointment.status === 'Confirmed'"
                        class="text-red-600 hover:text-red-900">
                  Cancel
                </button>
                <button (click)="deleteAppointment(appointment.id)"
                        class="text-red-600 hover:text-red-900 ml-2">
                  Delete
                </button>
              </div>
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
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  statistics = {
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    byDepartment: {} as { [key: string]: number }
  };

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadStatistics();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });
  }

  loadStatistics() {
    this.appointmentService.getAppointmentStatistics().subscribe(stats => {
      this.statistics = stats;
    });
  }

  getStatusClass(status: string): string {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'Confirmed':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'Completed':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'Cancelled':
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  updateStatus(appointment: Appointment, newStatus: 'Confirmed' | 'Completed' | 'Cancelled') {
    const updatedAppointment = { ...appointment, status: newStatus };
    this.appointmentService.updateAppointment(updatedAppointment).subscribe(() => {
      this.loadAppointments();
      this.loadStatistics();
    });
  }

  deleteAppointment(id: number | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe(() => {
        this.loadAppointments();
        this.loadStatistics();
      });
    }
  }
} 