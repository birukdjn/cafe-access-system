import axios from 'axios';
import { CafeAccessRecord } from '@/types/cafe';

const API_BASE_URL = 'https://localhost:7203/api';

export const getCafeAccessRecords = async (): Promise<CafeAccessRecord[]> => {
    try{
        const response = await axios.get<CafeAccessRecord[]>(`${API_BASE_URL}/CafeAccess`);
        return response.data;
    }
    catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("Axios error fetching cafe access:", error.message);
        throw new Error(`Failed to fetch cafe access data: ${error.response?.statusText || error.message}`);
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred while fetching cafe data.");
  }
};