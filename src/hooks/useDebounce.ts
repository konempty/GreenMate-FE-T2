import { useState, useEffect } from "react";

/**
 * 디바운싱 훅 - 입력값이 변경된 후 지정된 지연시간 후에 값을 업데이트
 * @param value - 디바운싱할 값
 * @param delay - 지연시간 (밀리초)
 * @returns 디바운싱된 값
 */

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 지연시간 후에 값을 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 값이 변경되면 이전 타이머를 취소
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
