export interface CafeScanRequest {
  scannableIdCode: string;
}

export interface CafeScanResponse {
  accessGranted: boolean;
  message: string;
  studentName: string | null;
  studentId: number | null;
  grantedMeal: string | null;
  scanTime: string;
}

export interface CafeAccessRecord {
  cafeAccessId: number;
  studentId: number;
  studentName: string;
  scannableIdCode: string;
  hasAccessedBreakfast: boolean;
  hasAccessedLunch: boolean;
  hasAccessedDinner: boolean;
  lastResetDate: string;
  totalDailyAccesses: number;
}