
export interface Appointment {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  timeSlot: string; // "09:00 AM - 10:00 AM"
  name: string;
  description: string;
  outcome?: string; // Meeting result
  status?: 'pending' | 'completed' | 'missed';
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
  role: 'admin';
}

export interface TimeSlot {
  label: string;
  startHour: number;
}
