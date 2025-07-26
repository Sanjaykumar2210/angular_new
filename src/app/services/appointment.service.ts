import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly STORAGE_KEY = 'appointments';
  private nextId = 1;

  constructor() {
    const appointments = this.getStoredAppointments();
    if (appointments.length > 0) {
      this.nextId = Math.max(...appointments.map(a => a.id || 0)) + 1;
    }
  }

  private getStoredAppointments(): Appointment[] {
    const appointments = localStorage.getItem(this.STORAGE_KEY);
    return appointments ? JSON.parse(appointments) : [];
  }

  private saveAppointments(appointments: Appointment[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appointments));
  }

  getAppointments(): Observable<Appointment[]> {
    return of(this.getStoredAppointments());
  }

  getAppointment(id: number): Observable<Appointment | undefined> {
    const appointments = this.getStoredAppointments();
    return of(appointments.find(a => a.id === id));
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    const appointments = this.getStoredAppointments();
    const newAppointment = {
      ...appointment,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      status: 'Pending' as const
    };
    appointments.push(newAppointment);
    this.saveAppointments(appointments);
    return of(newAppointment);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    const appointments = this.getStoredAppointments();
    const index = appointments.findIndex(a => a.id === appointment.id);
    if (index === -1) throw new Error('Appointment not found');
    appointments[index] = appointment;
    this.saveAppointments(appointments);
    return of(appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    const appointments = this.getStoredAppointments();
    const filteredAppointments = appointments.filter(a => a.id !== id);
    this.saveAppointments(filteredAppointments);
    return of(void 0);
  }

  getAppointmentsByDoctor(doctorId: number): Observable<Appointment[]> {
    const appointments = this.getStoredAppointments();
    return of(appointments.filter(a => a.doctorId === doctorId));
  }

  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    const appointments = this.getStoredAppointments();
    return of(appointments.filter(a => a.appointmentDate === date));
  }

  getAppointmentStatistics(): Observable<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    byDepartment: { [key: string]: number };
  }> {
    const appointments = this.getStoredAppointments();
    return of({
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'Pending').length,
      confirmed: appointments.filter(a => a.status === 'Confirmed').length,
      cancelled: appointments.filter(a => a.status === 'Cancelled').length,
      completed: appointments.filter(a => a.status === 'Completed').length,
      byDepartment: appointments.reduce((acc, app) => {
        acc[app.department] = (acc[app.department] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    });
  }
} 