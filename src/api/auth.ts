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

/**
 * 회원가입 (multipart/form-data)
 * - field "userInfo": JSON
 * - field "profileImage": 파일(optional)
 */
export async function signUp(payload: SignUpPayload, signal?: AbortSignal) {
  const fd = new FormData();

  fd.append(
    "userInfo",
    new Blob([JSON.stringify(payload.userInfo)], { type: "application/json" }),
  );

  if (payload.profileImage) {
    fd.append("profileImage", payload.profileImage);
  }

  await api.post("/v1/user/signup", fd, { signal });
}
