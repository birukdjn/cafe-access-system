import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error("❌ ERROR: NEXT_PUBLIC_API_URL is NOT defined!");
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cafeApi = {
  scan: async (scannableIdCode: string) => {
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
