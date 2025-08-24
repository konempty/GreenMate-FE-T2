import type { AxiosRequestConfig } from "axios";
import { api } from "./client";

/** 공통 GET: 응답의 data만 반환 */
export async function getJSON<T>(url: string, config?: AxiosRequestConfig) {
  const res = await api.get<T>(url, config);
  return res.data;
}
