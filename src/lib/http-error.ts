import axios from "axios";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function getString(obj: unknown, key: string) {
  return isRecord(obj) && typeof obj[key] === "string" ? obj[key] : undefined;
}

/** 에러 메시지 추출기 */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const serverMsg = getString(err.response?.data, "message");
    return serverMsg ?? err.message ?? "요청에 실패했습니다.";
  }
  return getString(err, "message") ?? "알 수 없는 오류가 발생했습니다.";
}

/** fetch/axios 취소 여부 공통 체크 */
export function isAbortError(err: unknown): boolean {
  const name = getString(err, "name");
  const message = getString(err, "message");
  return (
    (err instanceof DOMException && err.name === "AbortError") ||
    name === "CanceledError" ||
    message === "canceled"
  );
}
