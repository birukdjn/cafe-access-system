// services/cafeApi.ts
import { apiClient } from "@/lib/api";

export const cafeApi = {
  scan: async (scannableIdCode: string) => {
    try {
      const response = await apiClient.post("/CafeAccess/scan", {
        scannableIdCode,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) return error.response.data;
      throw error;
    }
  },
};
