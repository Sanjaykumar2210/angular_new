import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Patient, ApiResponse, ApiPatient, SinglePatientResponse } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly STORAGE_KEY = 'patients';
  private readonly BASE_URL = '/api/HospitalAppointment';
  private nextId = 1;

  constructor(private http: HttpClient) {
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

  private mapApiPatientToPatient(apiPatient: ApiPatient): Patient {
    return {
      id: apiPatient.patientId,
      name: apiPatient.name,
      age: apiPatient.age,
      gender: this.normalizeGender(apiPatient.gender),
      condition: 'Not specified',
      admissionDate: new Date().toISOString(),
      bloodGroup: 'Not specified',
      contactNumber: apiPatient.mobileNo,
      email: 'Not specified',
      address: apiPatient.city,
      status: 'Admitted'
    };
  }

  private mapPatientToApiPatient(patient: Patient): any {
    return {
      patientId: patient.id || 0,
      name: patient.name,
      mobileNo: patient.contactNumber,
      city: patient.address,
      age: patient.age,
      gender: patient.gender
    };
  }

  private normalizeGender(gender: string): 'Male' | 'Female' | 'Other' {
    const normalizedGender = gender.toLowerCase();
    if (normalizedGender.includes('male') || normalizedGender === 'm') return 'Male';
    if (normalizedGender.includes('female') || normalizedGender === 'f') return 'Female';
    return 'Other';
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<ApiResponse>(`${this.BASE_URL}/GetAllPatients`).pipe(
      map(response => {
        if (!response.result || !response.data) {
          return [];
        }
        return response.data.map(apiPatient => this.mapApiPatientToPatient(apiPatient));
      })
    );
  }

  getPatientById(id: number): Observable<Patient | null> {
    return this.http.get<SinglePatientResponse>(`${this.BASE_URL}/GetPatientByPatientId?patientId=${id}`).pipe(
      map(response => {
        if (!response.result || !response.data) {
          return null;
        }
        return this.mapApiPatientToPatient(response.data);
      }),
      catchError(() => of(null))
    );
  }

  getPatient(id: number): Observable<Patient | undefined> {
    // First try to get from API
    return this.getPatientById(id).pipe(
      map(patient => patient || undefined),
      catchError(() => {
        // If API fails, fallback to local storage
        const patients = this.getStoredPatients();
        const patient = patients.find(p => p.id === id);
        return of(patient);
      })
    );
  }

  createPatient(patient: Patient): Observable<Patient> {
    const apiPatient = this.mapPatientToApiPatient(patient);
    return this.http.post<ApiResponse>(`${this.BASE_URL}/AddNewPatient`, apiPatient).pipe(
      map(response => {
        if (!response.result) {
          throw new Error(response.message || 'Failed to add patient');
        }
        // If API call is successful, also save to local storage
        const newPatient = { ...patient, id: this.nextId++ };
        const patients = this.getStoredPatients();
        patients.push(newPatient);
        this.savePatients(patients);
        return newPatient;
      })
    );
  }

  updatePatient(patient: Patient): Observable<Patient> {
    const apiPatient = this.mapPatientToApiPatient(patient);
    return this.http.put<ApiResponse>(`${this.BASE_URL}/UpdatePatient`, apiPatient).pipe(
      map(response => {
        if (!response.result) {
          throw new Error(response.message || 'Failed to update patient');
        }
        // If API call is successful, also update local storage
        const patients = this.getStoredPatients();
        const index = patients.findIndex(p => p.id === patient.id);
        if (index !== -1) {
          patients[index] = patient;
          this.savePatients(patients);
        }
        return patient;
      }),
      catchError(error => {
        console.error('Error updating patient:', error);
        throw new Error('Failed to update patient. Please try again later.');
      })
    );
  }

  deletePatient(id: number): Observable<void> {
    // Only handle local storage deletion
    return new Observable<void>(subscriber => {
      try {
        const patients = this.getStoredPatients();
        const filteredPatients = patients.filter(p => p.id !== id);
        this.savePatients(filteredPatients);
        subscriber.next();
        subscriber.complete();
      } catch (error) {
        subscriber.error(new Error('Failed to delete patient'));
      }
    });
  }

  getPatientStatistics(): Observable<{
    total: number;
    admitted: number;
    discharged: number;
    underTreatment: number;
  }> {
    return this.getPatients().pipe(
      map((patients) => ({
        total: patients.length,
        admitted: patients.filter(p => p.status === 'Admitted').length,
        discharged: patients.filter(p => p.status === 'Discharged').length,
        underTreatment: patients.filter(p => p.status === 'Under Treatment').length
      }))
    );
  }
} 