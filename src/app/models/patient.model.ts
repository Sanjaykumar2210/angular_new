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