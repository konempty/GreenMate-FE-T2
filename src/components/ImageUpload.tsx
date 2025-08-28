import { useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { Label } from "./label";
import type { ImageData, ImageUploadProps } from "../types/imageUpload";

import "../styles/ImageUpload.css";

const ImageUpload = ({
  maxImages = 5,
  onChange,
  className,
}: ImageUploadProps) => {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const maxSizeInBytes = 1024 * 1024; // 1MB
      const allowedTypes = ["image/jpeg", "image/png"];

      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      Array.from(e.target.files).forEach((file) => {
        // 파일 크기 검증
        if (file.size > maxSizeInBytes) {
          invalidFiles.push(
            `${file.name}: 파일 크기가 1MB를 초과합니다. (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
          );
          return;
        }

        // MIME 타입 검증
        if (!allowedTypes.includes(file.type)) {
          invalidFiles.push(
            `${file.name}: 지원하지 않는 파일 형식입니다. (JPG, PNG 만 허용)`,
          );
          return;
        }

        validFiles.push(file);
      });

      // 검증 실패한 파일이 있으면 사용자에게 알림
      if (invalidFiles.length > 0) {
        alert(
          `다음 파일들을 업로드할 수 없습니다:\n\n${invalidFiles.join("\n")}`,
        );
      }

      // 유효한 파일만 처리
      if (validFiles.length > 0) {
        const newImages = validFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        const combinedImages = [...images, ...newImages];
        const updatedImages = combinedImages.slice(0, maxImages);
        const excessImages = combinedImages.slice(maxImages);

        excessImages.forEach((image) => URL.revokeObjectURL(image.preview));

        setImages(updatedImages);
        onChange(updatedImages);
      }

      // 파일 input 초기화 (같은 파일을 다시 선택할 수 있도록)
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[index].preview); // 메모리 해제
    updated.splice(index, 1);
    setImages(updated);
    onChange(updated);
  };

  return (
    <div className={className}>
      <div className="image-upload-info">
        선택된 파일 : {images.length}개
        <span className="image-upload-limit">
          (최대 {maxImages}개, 파일당 1MB 이하, JPG/PNG 지원)
        </span>
      </div>
      <div className="image-upload-container">
        {images.map((image, index) => (
          <div
            key={`${image.file.name}-${image.file.lastModified}`}
            className="image-upload-preview-wrapper"
          >
            <img
              src={image.preview}
              alt={`미리보기 ${index + 1}`}
              className="image-upload-preview"
            />
            <Button
              type="button"
              className="image-upload-remove"
              onClick={() => removeImage(index)}
            >
              <X size={18} color="white" />
            </Button>
          </div>
        ))}
        {images.length < maxImages && (
          <Label className="image-upload-label">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="image-upload-input"
            />
            <span className="image-upload-icon">+</span>
          </Label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
