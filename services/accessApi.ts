// services/accessApi.ts
import { apiClient } from "@/lib/api";

export const accessApi = {
  getAll: async () => {
    const response = await apiClient.get("/CafeAccess");
    return response.data;
  },

  create: async (data: { studentId: number; scannableIdCode: string }) => {
    const response = await apiClient.post("/CafeAccess", data);
    return response.data;
  },

  resetStudent: async (studentId: number) => {
    const response = await apiClient.put(`/CafeAccess/reset/${studentId}`);
    return response.data;
  },

  resetAll: async () => {
    const response = await apiClient.put("/CafeAccess/resetall");
    return response.data;
  },
};
