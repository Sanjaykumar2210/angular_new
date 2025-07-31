import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly API_URL = '/api/HospitalAppointment/GetAllPatients'; // Using patients as doctors for now

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map(response => {
        console.log('API Response:', response);
        if (response && response.data) {
          return response.data.map((user: any, index: number) => this.transformToDoctor(user, index));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching doctors:', error);
        return of([]);
      })
    );
  }

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(user => this.transformToDoctor(user, id - 1)),
      catchError(error => {
        console.error('Error fetching doctor:', error);
        throw error;
      })
    );
  }

  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<any>(this.API_URL, doctor).pipe(
      map(response => ({
        ...doctor,
        id: response.id
      })),
      catchError(error => {
        console.error('Error adding doctor:', error);
        throw error;
      })
    );
  }

  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.put<any>(`${this.API_URL}/${doctor.id}`, doctor).pipe(
      map(() => doctor),
      catchError(error => {
        console.error('Error updating doctor:', error);
        throw error;
      })
    );
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting doctor:', error);
        throw error;
      })
    );
  }

  private transformToDoctor(user: any, index: number): Doctor {
    const specialties = [
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

    return {
      id: user.patientId || user.id,
      name: `Dr. ${user.name}`,
      specialty: specialties[index % specialties.length],
      email: user.email || 'Not specified',
      phone: user.mobileNo || user.phone || 'Not specified',
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '9:00 AM - 5:00 PM'
      },
      experience: Math.floor(Math.random() * 15) + 5, // 5-20 years experience
      rating: (Math.random() * 1.5) + 3.5, // 3.5-5.0 rating
      image: ''
    };
  }

  getDoctorStatistics(): Observable<{
    total: number;
    bySpecialty: { [key: string]: number };
    averageRating: number;
  }> {
    return this.getDoctors().pipe(
      map(doctors => ({
        total: doctors.length,
        bySpecialty: doctors.reduce((acc, doc) => {
          acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number }),
        averageRating: doctors.length > 0 
          ? doctors.reduce((acc, doc) => acc + (doc.rating || 0), 0) / doctors.length 
          : 0
      }))
    );
  }
} 