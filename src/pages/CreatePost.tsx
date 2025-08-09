import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Circle, Pentagon } from "lucide-react";

import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Input from "../components/Input";
import { Label } from "../components/label";
import ImageUpload from "../components/ImageUpload";

import "../styles/CreatePost.css";

interface ImageData {
  file: File;
  preview: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // UI states (기능 없이 표시용)
  const [selectedAreaType, setSelectedAreaType] = useState<"circle" | "polygon" | null>(null);
  const [mapType, setMapType] = useState<"map" | "satellite">("map");

  const handleImageChange = (newImages: ImageData[]) => {
    setImages(newImages);
  };

  const handleCancel = () => {
    void navigate("/post");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, images, date, time });
    void navigate("/post");
  };

  const handleAreaTypeSelect = (type: "circle" | "polygon") => {
    if (selectedAreaType === type) {
      setSelectedAreaType(null);
    } else {
      setSelectedAreaType(type);
    }
  };

  const handleMapTypeChange = (type: "map" | "satellite") => {
    setMapType(type);
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
            <ImageUpload
              maxImages={3}
              onChange={handleImageChange}
              className="create-post-image-upload"
            />
          </div>
          <div className="create-post-form-row">
            <div className="create-post-form-group create-post-form-half">
              <Label className="create-post-label">마감 날짜</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="create-post-input"
              />
            </div>
            <div className="create-post-form-group create-post-form-half">
              <Label className="create-post-label">마감 시간</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="create-post-input"
              />
            </div>
          </div>
          <div className="create-post-form-group">
            <Label className="create-post-label">활동영역</Label>
            <div className="create-post-area-buttons">
              <Button
                type="button"
                className={`create-post-area-button ${selectedAreaType === "circle" ? 'active' : ''}`}
                onClick={() => handleAreaTypeSelect("circle")}
              >
                <Circle size={18} />
                원형 영역
              </Button>
              <Button
                type="button"
                className={`create-post-area-button ${selectedAreaType === "polygon" ? 'active' : ''}`}
                onClick={() => handleAreaTypeSelect("polygon")}
              >
                <Pentagon size={18} />
                다각형 영역
              </Button>
            </div>
            <div className="create-post-area-controls">
              <Button type="button" className="create-post-area-clear-btn">
                영역 지우기
              </Button>
            </div>
            {/* 지도 컨테이너 */}
            <div className="create-post-map-container">
              <div className="map-placeholder interactive-map">
                {/* 맵 타입 토글 버튼 */}
                <div className="create-post-map-toggle-overlay">
                  <Button
                    type="button"
                    className={`create-post-map-toggle ${mapType === "map" ? "active" : ""}`}
                    onClick={() => handleMapTypeChange("map")}
                  >
                    Map
                  </Button>
                  <Button
                    type="button"
                    className={`create-post-map-toggle ${mapType === "satellite" ? "active" : ""}`}
                    onClick={() => handleMapTypeChange("satellite")}
                  >
                    Satellite
                  </Button>
                </div>
                <p>구글 맵 API가 연결될 예정입니다.</p>
              </div>
            </div>
          </div>
          <div className="create-post-buttons">
            <Button type="button" className="create-post-cancel" onClick={handleCancel}>
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
