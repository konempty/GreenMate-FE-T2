import { api } from "./client";

export type SignUpTermAgreement = {
  termId: number;
  agreed: boolean;
};

export interface SignUpUserInfo {
  email: string; // <= 100
  password: string; // 8~100
  nickname: string; // 2~10
  selfIntroduction?: string; // <= 300
  signUpTermAgreements: SignUpTermAgreement[];
}

export interface SignUpPayload {
  userInfo: SignUpUserInfo;
  profileImage?: File | null; // 옵션
}

export async function signUp(
  payload: SignUpPayload,
  signal?: AbortSignal,
): Promise<void> {
  const fd = new FormData();

  // 문자열 JSON으로 넣기
  fd.append("userInfo", JSON.stringify(payload.userInfo));

  if (payload.profileImage) {
    fd.append("profileImage", payload.profileImage);
  }

  await api.post("/v1/user/signup", fd, { signal });
}

/**
 * 닉네임 중복 확인
 * - 204  -> 사용 가능
 * - 409            -> 중복
 * - 그 외          -> 에러
 */
export async function checkNickname(
  nickname: string,
  signal?: AbortSignal,
): Promise<"available" | "duplicate" | "invalid" | "serverError"> {
  const res = await api.head(
    `/v1/user/nicknames/${encodeURIComponent(nickname)}`,
    {
      signal,
      validateStatus: () => true,
    },
  );

  if (res.status === 204) return "available";
  if (res.status === 409) return "duplicate";
  if (res.status === 400) return "invalid";
  if (res.status === 500) return "serverError";
  return "invalid";
}
