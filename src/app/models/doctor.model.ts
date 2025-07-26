export interface Doctor {
  id?: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: {
    days: string[];
    hours: string;
  };
  image?: string;
  experience: number;
  patients?: number[];
  rating?: number;
} 