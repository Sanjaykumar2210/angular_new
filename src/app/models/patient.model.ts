export interface ApiPatient {
  patientId: number;
  name: string;
  mobileNo: string;
  city: string;
  age: number;
  gender: string;
}

export interface ApiResponse {
  message: string;
  result: boolean;
  data: ApiPatient[];
}

export interface SinglePatientResponse {
  message: string;
  result: boolean;
  data: ApiPatient | null;
}

export interface Patient {
  id?: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  admissionDate: string;
  bloodGroup: string;
  contactNumber: string;
  email: string;
  address: string;
  assignedDoctor?: number;
  reports?: {
    date: string;
    type: string;
    result: string;
    file?: string;
  }[];
  status: 'Admitted' | 'Discharged' | 'Under Treatment';
} 