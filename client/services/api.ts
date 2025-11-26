/**
 * Centralized API Service using Axios
 * Frontend-only HTTP client for all API calls
 */

import axios, { AxiosInstance, AxiosError } from "axios";

// Initialize axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://iglesia360-api.unify-tec.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add auth token if available
 */
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("[API] Error parsing auth data:", error);
      }
    }
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("[API] Response error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear auth on unauthorized
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/**
 * Auth API calls
 */
export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post("/api/auth/login", { username, password }),

  logout: () => {
    localStorage.removeItem("auth");
  },

  getProfile: () => apiClient.get("/api/users/me"),
};

/**
 * Users API calls
 */
export const usersApi = {
  getAll: () => apiClient.get("/api/users"),
  getById: (id: string | number) => apiClient.get(`/api/users/${id}`),
  create: (data: any) => apiClient.post("/api/users", data),
  update: (id: string | number, data: any) =>
    apiClient.put(`/api/users/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/api/users/${id}`),
};

/**
 * Ministries API calls
 */
export const ministriesApi = {
  getAll: () => apiClient.get("/api/ministries"),
  getById: (id: string | number) => apiClient.get(`/api/ministries/${id}`),
};

/**
 * Solicitudes API calls
 */
export const solicitudesApi = {
  getAll: () => apiClient.get("/api/solicitudes"),
  getById: (id: string | number) => apiClient.get(`/api/solicitudes/${id}`),
  create: (data: any) => apiClient.post("/api/solicitudes", data),
  update: (id: string | number, data: any) =>
    apiClient.put(`/api/solicitudes/${id}`, data),
  submit: (id: string | number, data?: any) =>
    apiClient.post(`/api/solicitudes/${id}/submit`, data),
  getDashboardStats: () => apiClient.get("/api/solicitudes/dashboard/stats"),
};

/**
 * Approvals API calls
 */
export const approvalsApi = {
  getApprovals: (solicitudId: string | number) =>
    apiClient.get(`/api/solicitudes/${solicitudId}/approvals`),
  approve: (solicitudId: string | number, data: any) =>
    apiClient.post(`/api/solicitudes/${solicitudId}/approve`, data),
  reject: (solicitudId: string | number, data: any) =>
    apiClient.post(`/api/solicitudes/${solicitudId}/reject`, data),
};

export default apiClient;
