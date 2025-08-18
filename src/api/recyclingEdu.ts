import { api } from "./client";

export type BackendPost = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
};

export async function fetchRecyclingEduPosts(signal?: AbortSignal) {
  const res = await api.get<BackendPost[]>("/v1/recycling-edu-posts", {
    signal,
  });
  return res.data;
}

export async function fetchRecyclingEduPost(
  id: string | number,
  signal?: AbortSignal,
) {
  const res = await api.get<BackendPost>(`/v1/recycling-edu-posts/${id}`, {
    signal,
  });
  return res.data;
}
