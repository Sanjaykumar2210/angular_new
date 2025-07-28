import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Appointment, AppointmentResponse } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly BASE_URL = '/api/HospitalAppointment';

  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<AppointmentResponse>(`${this.BASE_URL}/GetAllAppointments`).pipe(
      map(response => {
        if (!response.result || !response.data) {
          return [];
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching appointments:', error);
        return of([]);
      })
    );
  }

  getTodaysAppointments(): Observable<Appointment[]> {
    return this.getAllAppointments().pipe(
      map(appointments => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === today.getTime();
        });
      })
    );
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.getAllAppointments().pipe(
      map(appointments => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() >= today.getTime();
        }).sort((a, b) => 
          new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
        );
      })
    );
  }

  getAppointmentsByPatientId(patientId: number): Observable<Appointment[]> {
    return this.getAllAppointments().pipe(
      map(appointments => appointments.filter(a => a.patientId === patientId))
    );
  }

  createAppointment(appointment: {
    name: string;
    mobileNo: string;
    city: string;
    age: number;
    gender: string;
    appointmentDate: string;
    appointmentTime: string;
    isFirstVisit: boolean;
    naration: string;
  }): Observable<Appointment> {
    return this.http.post<AppointmentResponse>(`${this.BASE_URL}/AddNewAppointment`, appointment).pipe(
      map(response => {
        if (!response.result) {
          throw new Error(response.message || 'Failed to create appointment');
        }
        return response.data[0];
      }),
      catchError(error => {
        console.error('Error creating appointment:', error);
        throw new Error('Failed to create appointment. Please try again later.');
      })
    );
  }

  updateAppointmentStatus(appointmentId: number, isDone: boolean): Observable<void> {
    const updateData = {
      appointmentId,
      isDone
    };

    return this.http.post<AppointmentResponse>(`${this.BASE_URL}/UpdateAppointmentStatus`, updateData).pipe(
      map(response => {
        if (!response.result) {
          throw new Error(response.message || 'Failed to update appointment status');
        }
      }),
      catchError(error => {
        console.error('Error updating appointment status:', error);
        throw new Error('Failed to update appointment status. Please try again later.');
      })
    );
  }
} 