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
