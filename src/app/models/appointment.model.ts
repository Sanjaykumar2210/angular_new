export interface Appointment {
  id?: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: number;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  symptoms?: string;
  notes?: string;
  createdAt: string;
} 