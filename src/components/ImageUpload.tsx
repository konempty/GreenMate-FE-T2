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
      const newImages = Array.from(e.target.files).map((file) => ({
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
      <div className="image-upload-info">선택된 파일 : {images.length}개</div>
      <div className="image-upload-container">
        {images.map((image, index) => (
          <div key={`${image.file.name}-${image.file.lastModified}`} className="image-upload-preview-wrapper">
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
