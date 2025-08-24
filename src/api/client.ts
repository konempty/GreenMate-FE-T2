import axios, { type AxiosInstance } from "axios";

console.log("[ENV] BASE =", import.meta.env.VITE_API_BASE_URL);

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});
