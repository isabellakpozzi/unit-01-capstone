import axios, { AxiosError } from "axios";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function extractErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "something went wrong. try again.";
  }

  const axiosError = error as AxiosError<any>;
  const data = axiosError.response?.data;

  if (!data) return axiosError.message || "something went wrong. try again.";

  if (data.message) return data.message;
  if (data.err) return data.err;

  if (data.code === 11000) {
    const field = data.keyValue ? Object.keys(data.keyValue)[0] : "field";
    return `That ${field} is already in use.`;
  }

  if (data.errors && typeof data.errors === "object") {
    const firstError = Object.values(data.errors)[0] as { message?: string } | undefined;
    if (firstError?.message) return firstError.message;
  }

  return "something went wrong. try again.";
}

export default api;