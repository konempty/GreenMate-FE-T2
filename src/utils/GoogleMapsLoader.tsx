interface WindowWithGoogleMaps extends Window {
  [key: string]: unknown;
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = new Promise<void>((resolve, reject) => {
      // 이미 로드되어 있는지 확인
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        this.isLoading = false;
        resolve();
        return;
      }

      // API 키 확인
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
      if (!apiKey) {
        reject(new Error("Google Maps API 키가 설정되지 않았습니다."));
        return;
      }

      // 콜백 함수 설정
      const callbackName = "initGoogleMaps" + Date.now();
      const windowWithCallback = window as unknown as WindowWithGoogleMaps;
      windowWithCallback[callbackName] = () => {
        this.isLoaded = true;
        this.isLoading = false;
        delete windowWithCallback[callbackName];
        resolve();
      };

      // 스크립트 태그 생성
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&libraries=drawing,geometry`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        this.isLoading = false;
        delete windowWithCallback[callbackName];
        reject(new Error("Google Maps API 로드에 실패했습니다."));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  isGoogleMapsLoaded(): boolean {
    return !!(this.isLoaded && window.google && window.google.maps);
  }
}

export default GoogleMapsLoader;
