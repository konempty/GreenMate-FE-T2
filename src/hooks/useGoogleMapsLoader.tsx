import { useState, useEffect } from "react";
import GoogleMapsLoader from "../utils/GoogleMapsLoader";

interface UseGoogleMapsLoaderReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  loadProgress: number;
}

export const useGoogleMapsLoader = (): UseGoogleMapsLoaderReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let progressInterval: ReturnType<typeof setInterval>;

    const loadGoogleMaps = async () => {
      try {
        setError(null);
        setIsLoading(true);

        // 로딩 진행률 시뮬레이션
        let progress = 0;
        progressInterval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress > 90) {
            progress = 90;
            clearInterval(progressInterval);
          }
          if (isMounted) {
            setLoadProgress(progress);
          }
        }, 100);

        const loader = GoogleMapsLoader.getInstance();
        await loader.load();

        if (isMounted) {
          setLoadProgress(100);
          setTimeout(() => {
            if (isMounted) {
              setIsLoaded(true);
              setIsLoading(false);
            }
          }, 200); // 100% 완료를 잠깐 보여주기
        }
      } catch (err) {
        console.error("Google Maps 로드 오류:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Google Maps API 로드에 실패했습니다.",
          );
          setIsLoading(false);
        }
      } finally {
        clearInterval(progressInterval);
      }
    };

    void loadGoogleMaps();

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
    };
  }, []);

  return {
    isLoaded,
    isLoading,
    error,
    loadProgress: Math.round(loadProgress),
  };
};
