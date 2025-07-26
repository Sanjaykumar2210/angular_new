import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly STORAGE_KEY = 'patients';
  private nextId = 1;

  constructor() {
    // Initialize nextId based on existing patients
    const patients = this.getStoredPatients();
    if (patients.length > 0) {
      this.nextId = Math.max(...patients.map(p => p.id || 0)) + 1;
    }
  }

  private getStoredPatients(): Patient[] {
    const patients = localStorage.getItem(this.STORAGE_KEY);
    return patients ? JSON.parse(patients) : [];
  }

  private savePatients(patients: Patient[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patients));
  }

  getPatients(): Observable<Patient[]> {
    return of(this.getStoredPatients());
  }

  getPatient(id: number): Observable<Patient | undefined> {
    const patients = this.getStoredPatients();
    const patient = patients.find(p => p.id === id);
    return of(patient);
  }

  createPatient(patient: Patient): Observable<Patient> {
    const patients = this.getStoredPatients();
    const newPatient = { ...patient, id: this.nextId++ };
    patients.push(newPatient);
    this.savePatients(patients);
    return of(newPatient);
  }

  updatePatient(patient: Patient): Observable<Patient> {
    const patients = this.getStoredPatients();
    const index = patients.findIndex(p => p.id === patient.id);
    if (index === -1) throw new Error('Patient not found');
    patients[index] = patient;
    this.savePatients(patients);
    return of(patient);
  }

  deletePatient(id: number): Observable<void> {
    const patients = this.getStoredPatients();
    const filteredPatients = patients.filter(p => p.id !== id);
    this.savePatients(filteredPatients);
    return of(void 0);
  }

  getPatientStatistics(): Observable<{
    total: number;
    admitted: number;
    discharged: number;
    underTreatment: number;
  }> {
    const patients = this.getStoredPatients();
    return of({
      total: patients.length,
      admitted: patients.filter(p => p.status === 'Admitted').length,
      discharged: patients.filter(p => p.status === 'Discharged').length,
      underTreatment: patients.filter(p => p.status === 'Under Treatment').length
    });
  }
} 