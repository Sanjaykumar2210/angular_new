import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';

interface DashboardData {
  totalPatients: number;
  totalAppointments: number;
  todaysTotalAppointments: number;
  todaysTotalDoneAppointments: number;
}

interface DashboardResponse {
  message: string;
  result: boolean;
  data: DashboardData[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly BASE_URL = '/api/HospitalAppointment';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardResponse>(`${this.BASE_URL}/GetDashboardData`).pipe(
      map(response => {
        if (!response.result || !response.data?.length) {
          throw new Error('Failed to load dashboard data');
        }
        return response.data[0];
      })
    );
  }
} 