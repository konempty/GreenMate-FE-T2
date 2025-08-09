import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import { X } from "lucide-react";

import Button from "../components/Button";
import Input from "../components/Input";
import { Label } from "../components/label";

import "../styles/CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<{ file: File, preview: string }[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // 최대 5개 제한
    }
  };
  const removeImage = (index: number) => {
  setImages(prev => {
    const updated = [...prev];
    URL.revokeObjectURL(updated[index].preview); // 메모리 해제
    updated.splice(index, 1);
    return updated;
    });
  };

  const handleCancel = () => {
    void navigate("/post");
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 로직
    console.log({ title, description, images });
    void navigate("/post");
  };

  return (
    <div className="create-post-container">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>
      <main className="create-post-main">
        <h1 className="create-post-title">팀 모집글 작성</h1>
        <form className="create-post-form">
          <div className="create-post-form-group">
            <Label className="create-post-label">제목</Label>
            <Input
              id="title"
              type="text"
              placeholder="제목을 작성해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="create-post-input"
            />
          </div>
          <div className="create-post-form-group">
            <Label className="create-post-label">내용</Label>
            <textarea
              id="description"
              placeholder="내용을 작성해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="create-post-textarea"
              rows={6}
            />
          </div>
          <div className="create-post-form-group">
            <Label className="create-post-label">이미지 첨부 (최대 3개)</Label>
            <div className="create-post-image-info">
              선택된 파일 : {images.length}개
            </div>
            <div className="create-post-image-container">
              {images.map((image, index) => (
                <div key={index} className="create-post-image-preview-wrapper">
                  <img src={image.preview} alt={`미리보기 ${index + 1}`} className="create-post-image-preview" />
                  <Button
                    type="button"
                    className="create-post-image-remove"
                    onClick={() => removeImage(index)}
                  >
                    <X size={18} color="white" />
                  </Button>
                </div>
              ))}
              {images.length < 3 && (
                <Label className="create-post-upload-label">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="create-post-upload-input"
                  />
                  <span className="create-post-upload-icon">+</span>
                </Label>
              )}
            </div>
          </div>
          <div className="create-post-buttons">
            <Button className="create-post-cancel" onClick={handleCancel}>
              취소
            </Button>
            <Button className="create-post-submit" onClick={handleSubmit}>
              작성 완료
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
