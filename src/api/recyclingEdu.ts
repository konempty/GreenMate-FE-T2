import { getJSON } from "./http";

export type BackendPost = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
};

// 목록
export function fetchRecyclingEduPosts(
  signal?: AbortSignal,
  params?: { page?: number; size?: number; q?: string; sort?: string },
) {
  return getJSON<BackendPost[]>("/v1/recycling-edu-posts", { signal, params });
}

export function fetchRecyclingEduPost(
  id: number | string,
  signal?: AbortSignal,
) {
  return getJSON<BackendPost>(`/v1/recycling-edu-posts/${id}`, { signal });
}
