import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Input from "../components/Input";
import { Label } from "../components/label";
import ImageUpload from "../components/ImageUpload";
import MapArea from "../components/MapArea";
import type { AreaData } from "../types/mapArea";
import type { ImageData } from "../types/imageUpload";

import "../styles/CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [areaData, setAreaData] = useState<AreaData>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 현재 날짜 가져오기 (YYYY-MM-DD 형식)
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleImageChange = (newImages: ImageData[]) => {
    setImages(newImages);
  };

  const handleAreaChange = (newAreaData: AreaData) => {
    setAreaData(newAreaData);
    if (newAreaData) {
      setErrors((prev) => ({ ...prev, area: "" }));
    }
  };

  const handleCancel = () => {
    void navigate("/post");
  };

  // 폼 유효성 검사 함수
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    if (!description.trim()) {
      newErrors.description = "내용을 입력해주세요.";
    }

    if (!date) {
      newErrors.date = "마감 날짜를 선택해주세요.";
    }

    if (!time) {
      newErrors.time = "마감 시간을 선택해주세요.";
    }

    if (date && time) {
      const selectedDateTime = new Date(`${date}T${time}:00`);
      const currentDateTime = new Date();

      if (selectedDateTime <= currentDateTime) {
        newErrors.datetime = "마감 날짜와 시간은 현재 시간보다 이후여야 합니다.";
      }
    }

    if (!areaData) {
      newErrors.area = "활동영역을 설정해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log({ title, description, images, date, time, areaData });
    void navigate("/post");
  };

  // 입력 시 에러 제거
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    if (errors.date || errors.datetime) {
      setErrors((prev) => ({ ...prev, date: "", datetime: "" }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (errors.time || errors.datetime) {
      setErrors((prev) => ({ ...prev, time: "", datetime: "" }));
    }
  };

  return (
    <div className="create-post-container">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>

      <main className="create-post-main">
        <h1 className="create-post-title">팀 모집글 작성</h1>

        <form className="create-post-form" onSubmit={handleSubmit}>
          {/* 제목 입력 */}
          <div className="create-post-form-group">
            <Label className="create-post-label">
              제목 *
              <span className="create-post-char-count">{title.length}/50</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="제목을 작성해주세요"
              value={title}
              onChange={handleTitleChange}
              className={`create-post-input ${errors.title ? "error" : ""}`}
              maxLength={50}
            />
            {errors.title && (
              <span className="create-post-error">{errors.title}</span>
            )}
          </div>

          {/* 내용 입력 */}
          <div className="create-post-form-group">
            <Label className="create-post-label">
              내용 *
              <span className="create-post-char-count">
                {description.length}/4000
              </span>
            </Label>
            <textarea
              id="description"
              placeholder="내용을 작성해주세요"
              value={description}
              onChange={handleDescriptionChange}
              className={`create-post-textarea ${
                errors.description ? "error" : ""
              }`}
              rows={6}
              maxLength={4000}
            />
            {errors.description && (
              <span className="create-post-error">{errors.description}</span>
            )}
          </div>

          {/* 이미지 업로드 */}
          <div className="create-post-form-group">
            <Label className="create-post-label">이미지 첨부 (최대 3개)</Label>
            <ImageUpload
              maxImages={3}
              onChange={handleImageChange}
              className="create-post-image-upload"
            />
          </div>

          {/* 마감 날짜 및 시간 */}
          <div className="create-post-form-group">
            <div className="create-post-form-row">
              <div className="create-post-form-group create-post-form-half">
                <Label className="create-post-label">마감 날짜 *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className={`create-post-input ${errors.date || errors.datetime ? "error" : ""}`}
                  min={getCurrentDate()}
                />
                {errors.date && (
                  <span className="create-post-error">{errors.date}</span>
                )}
              </div>
              <div className="create-post-form-group create-post-form-half">
                <Label className="create-post-label">마감 시간 *</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className={`create-post-input ${errors.time || errors.datetime ? "error" : ""}`}
                />
                {errors.time && (
                  <span className="create-post-error">{errors.time}</span>
                )}
              </div>
            </div>
            {/* 날짜/시간 조합 에러 메시지 */}
            {errors.datetime && (
              <span className="create-post-error" style={{ marginTop: "8px" }}>
                {errors.datetime}
              </span>
            )}
          </div>

          {/* 활동영역 설정  */}
          <div className="create-post-form-group">
            <MapArea onAreaChange={handleAreaChange} />
            {errors.area && (
              <span className="create-post-error">{errors.area}</span>
            )}
          </div>

          <div className="create-post-buttons">
            <Button
              type="button"
              className="create-post-cancel"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button type="submit" className="create-post-submit">
              작성 완료
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePost;
