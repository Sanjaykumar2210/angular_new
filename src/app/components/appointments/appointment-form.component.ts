import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Schedule New Appointment</h2>
        
        <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Patient Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Patient Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  formControlName="patientName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  [ngClass]="{'border-red-500': appointmentForm.get('patientName')?.invalid && appointmentForm.get('patientName')?.touched}"
                >
                <div *ngIf="appointmentForm.get('patientName')?.invalid && appointmentForm.get('patientName')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Name is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  formControlName="patientEmail"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  [ngClass]="{'border-red-500': appointmentForm.get('patientEmail')?.invalid && appointmentForm.get('patientEmail')?.touched}"
                >
                <div *ngIf="appointmentForm.get('patientEmail')?.invalid && appointmentForm.get('patientEmail')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Valid email is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  formControlName="patientPhone"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  [ngClass]="{'border-red-500': appointmentForm.get('patientPhone')?.invalid && appointmentForm.get('patientPhone')?.touched}"
                >
                <div *ngIf="appointmentForm.get('patientPhone')?.invalid && appointmentForm.get('patientPhone')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Phone number is required
                </div>
              </div>
            </div>
          </div>

          <!-- Appointment Details -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Appointment Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Department</label>
                <select
                  formControlName="department"
                  (change)="onDepartmentChange()"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  formControlName="doctorId"
                  (change)="onDoctorChange($event)"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Doctor</option>
                  <option *ngFor="let doctor of filteredDoctors" [value]="doctor.id">
                    {{ doctor.name }} - {{ doctor.specialty }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  formControlName="appointmentDate"
                  [min]="minDate"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Time</label>
                <select
                  formControlName="appointmentTime"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Time</option>
                  <option *ngFor="let time of availableTimes" [value]="time">{{ time }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Additional Information</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700">Symptoms/Reason for Visit</label>
              <textarea
                formControlName="symptoms"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                formControlName="notes"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="appointmentForm.invalid"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
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
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  minDate = new Date().toISOString().split('T')[0];
  departments = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Dermatology',
    'Orthopedics',
    'Oncology',
    'General Medicine',
    'Surgery',
    'Psychiatry',
    'Gynecology'
  ];
  availableTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM'
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      patientName: ['', Validators.required],
      patientEmail: ['', [Validators.required, Validators.email]],
      patientPhone: ['', Validators.required],
      department: ['', Validators.required],
      doctorId: ['', Validators.required],
      doctorName: [''],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      symptoms: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  onDepartmentChange() {
    const department = this.appointmentForm.get('department')?.value;
    this.filteredDoctors = this.doctors.filter(doctor => 
      doctor.specialty === department
    );
    this.appointmentForm.patchValue({ doctorId: '', doctorName: '' });
  }

  onDoctorChange(event: any) {
    const doctorId = event.target.value;
    const doctor = this.doctors.find(d => d.id === Number(doctorId));
    if (doctor) {
      this.appointmentForm.patchValue({ doctorName: doctor.name });
    }
  }

  onSubmit() {
    if (this.appointmentForm.invalid) return;

    this.appointmentService.createAppointment(this.appointmentForm.value)
      .subscribe(() => {
        this.router.navigate(['/appointments']);
      });
  }

  onCancel() {
    this.router.navigate(['/appointments']);
  }
} 