import axios, { type AxiosInstance } from "axios";

console.log("[ENV] BASE =", import.meta.env.VITE_API_BASE_URL);

const envBase = import.meta.env.VITE_API_BASE_URL;
const baseURL: string =
  typeof envBase === "string" && envBase.length > 0 ? envBase : "/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});
