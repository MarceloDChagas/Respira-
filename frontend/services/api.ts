import axios from 'axios';
import { Platform } from 'react-native';

// Determina baseURL dinamicamente:
// 1) Usa variáveis de ambiente Expo se definidas (EXPO_PUBLIC_API_URL)
// 2) Para Android emulator usa 10.0.2.2
// 3) Caso contrário localhost
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor simples para logar erros de rede e facilitar debug
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ERR_NETWORK') {
      console.warn('[API] Network error. baseURL=', API_URL);
    }
    return Promise.reject(err);
  }
);

export interface CalculationResponse {
  emissions_kg: number;
  category: string;
}

export const calculatorApi = {
  calculateTransport: async (transportType: string, distanceKm: number): Promise<CalculationResponse> => {
    const response = await api.post<CalculationResponse>('/api/calculate/transport', {
      transport_type: transportType,
      distance_km: distanceKm,
    });
    return response.data;
  },

  calculateEnergy: async (energyType: string, consumption: number): Promise<CalculationResponse> => {
    const response = await api.post<CalculationResponse>('/api/calculate/energy', {
      energy_type: energyType,
      consumption: consumption,
    });
    return response.data;
  },

  calculateFood: async (dietType: string, days: number): Promise<CalculationResponse> => {
    const response = await api.post<CalculationResponse>('/api/calculate/food', {
      diet_type: dietType,
      days: days,
    });
    return response.data;
  },
};

export const authApi = {
  login: async (email: string, password: string): Promise<{ access_token: string; name?: string }> => {
    const response = await api.post<{ access_token: string; name?: string }>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<{ access_token: string; name?: string }> => {
    const response = await api.post<{ access_token: string; name?: string }>('/api/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },
};
