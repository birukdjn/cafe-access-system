import axios from 'axios';

const API_BASE_URL = 'https://localhost:7203/api';
const DEMO_MODE = false; // turn off when backend is ready

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// DEMO MODE response that matches backend exactly
const generateDemoResponse = (scannableIdCode: string) => {
  const isGranted = Math.random() > 0.3;
  const names = ["Bob Johnson", "Sara Ali", "Mikel Tesfaye", "Helen Kidane"];

  return {
    accessGranted: isGranted,
    message: isGranted ? "Welcome! Access granted." : "Already used today.",
    studentName: names[Math.floor(Math.random() * names.length)],
    studentId: Math.floor(Math.random() * 100),
    grantedMeal: isGranted ? "Lunch" : null,
    scanTime: new Date().toISOString(),
  };
};

export const cafeApi = {
  scan: async (scannableIdCode: string) => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 400));
      return generateDemoResponse(scannableIdCode);
    }

    try {
      const response = await apiClient.post('/CafeAccess/scan', {
        scannableIdCode,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) return error.response.data;
      throw error;
    }
  },

  createAccessRecord: async (data: { studentId: number; scannableIdCode: string }) => {
    const response = await apiClient.post('/CafeAccess', data);
    return response.data;
  },

  resetStudentAccess: async (studentId: number) => {
    const response = await apiClient.put(`/CafeAccess/reset/${studentId}`);
    return response.data;
  },

  resetAllAccess: async () => {
    const response = await apiClient.put('/CafeAccess/resetall');
    return response.data;
  },
};