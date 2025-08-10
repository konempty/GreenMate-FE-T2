export interface ImageData {
  file: File;
  preview: string;
}

export interface ImageUploadProps {
  maxImages?: number;
  onChange: (images: ImageData[]) => void;
  className?: string;
}
