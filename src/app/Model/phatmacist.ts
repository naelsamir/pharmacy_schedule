export interface Pharmacist {
  id: number;
  name?: string;
  gender?: 'male' | 'female';
  monthlySchedules?: MonthlySchedule[]; // Reference to monthly schedules for this pharmacist
  isPharmacist?: boolean;
}

export interface MonthlySchedule {
  id: number; // Unique identifier for the monthly schedule
  month: number;
  ScheduleDetails: ScheduleDetails;
}

export interface ScheduleDetails {
  weekendCountSahar: number;
  inVacation: boolean;
  vacationStart?: Date | null;
  vacationEnd?: Date | null;
  totalSaharNumber: number;
  weekDayCountSahar: number;
  vacationDays?: number;
}

export interface Shift {
  shift_id: number;
  start_time: Date;
  end_time: Date;
}

export interface DailySchedule {
  date: Date;
  shift: Shift;
  pharmacists: Pharmacist[];
  month: number;
}
