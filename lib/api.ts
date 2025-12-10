import axios from 'axios';

const API_BASE_URL = 'https://localhost:7203/api';
const DEMO_MODE = true; // Set to false when you have a real backend

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Demo data generator
const generateDemoResponse = (scannableIdCode: string) => {
  const isGranted = Math.random() > 0.3; // 70% success rate
  const studentNames = ['Ahmed Ali', 'Fatima Hassan', 'Omar Khalid', 'Layla Ahmed', 'Youssef Ibrahim'];
  const randomName = studentNames[Math.floor(Math.random() * studentNames.length)];
  
  return {
    studentId: Math.floor(Math.random() * 1000) + 1,
    studentName: randomName,
    scannableIdCode: scannableIdCode,
    accessGranted: isGranted,
    message: isGranted 
      ? `Access granted! Welcome ${randomName}` 
      : `Access denied - Already used today`,
    timestamp: new Date().toISOString(),
  };
};

export const cafeApi = {
  // Scan a student ID - handles both 200 and 403 responses
  scan: async (scannableIdCode: string) => {
    // Demo mode - simulate response
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return generateDemoResponse(scannableIdCode);
    }

    // Real API mode
    try {
      const response = await apiClient.post('/CafeAccess/scan', {
        scannableIdCode,
      });
      return response.data;
    } catch (error: any) {
      // If it's a 403 error with data, return the error response data
      if (error.response?.status === 403 && error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Get all cafe access records
  getAllAccessRecords: async () => {
    const response = await apiClient.get('/CafeAccess');
    return response.data;
  },

  // Get specific student access record
  getStudentAccess: async (studentId: number) => {
    const response = await apiClient.get(`/CafeAccess/student/${studentId}`);
    return response.data;
  },

  // Create new cafe access record
  createAccessRecord: async (data: { studentId: number; scannableIdCode: string }) => {
    const response = await apiClient.post('/CafeAccess', data);
    return response.data;
  },

  // Reset individual student access
  resetStudentAccess: async (studentId: number) => {
    const response = await apiClient.put(`/CafeAccess/reset/${studentId}`);
    return response.data;
  },

  // Reset all students access
  resetAllAccess: async () => {
    const response = await apiClient.put('/CafeAccess/resetall');
    return response.data;
  },
};