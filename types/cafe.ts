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
