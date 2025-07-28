export interface DashboardData {
  totalPatients: number;
  totalAppointments: number;
  todaysTotalAppointments: number;
  todaysTotalDoneAppointments: number;
}

export interface DashboardResponse {
  message: string;
  result: boolean;
  data: DashboardData[];
} 