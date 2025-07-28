export interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  appointmentTime: string;
  isFirstVisit: boolean;
  naration: string;
  name: string;
  patientId: number;
  mobileNo: string;
  isDone: boolean;
  appointmentNo: number;
}

export interface AppointmentResponse {
  message: string;
  result: boolean;
  data: Appointment[];
} 