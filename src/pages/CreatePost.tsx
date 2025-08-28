import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Input from "../components/Input";
import { Label } from "../components/label";
import ImageUpload from "../components/ImageUpload";
import CreateMapArea from "../components/CreateMapArea";
import type { AreaData } from "../types/mapArea";
import type { ImageData } from "../types/imageUpload";
import {
  createGreenTeamPost,
  type GreenTeamPostCreateRequest,
  type GeoJSON,
} from "../api/greenTeamPost";

import "../styles/CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [areaData, setAreaData] = useState<AreaData | null>(null);
  const [locationType, setLocationType] = useState<"CIRCLE" | "POLYGON" | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // 성공적으로 제출 완료된 상태

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentRequestRef = useRef<AbortController | null>(null);

  // 컴포넌트 언마운트 시 진행 중인 요청 취소
  useEffect(() => {
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleImageChange = (newImages: ImageData[]) => {
    setImages(newImages);
  };

  const handleAreaChange = (
    newAreaData: AreaData | null,
    newLocationType: "CIRCLE" | "POLYGON" | null,
  ) => {
    setAreaData(newAreaData);
    setLocationType(newLocationType);
    if (newAreaData) {
      setErrors((prev) => ({ ...prev, area: "" }));
    }
  };

  const handleCancel = () => {
    void navigate("/post");
  };

  // 날짜와 시간을 ISO 8601 형식으로 변환하는 헬퍼 함수
  const formatDateTime = (date: string, time: string): string => {
    return `${date}T${time}:00`;
  };

  // AreaData를 백엔드 형식에 맞게 변환하는 헬퍼 함수
  const convertAreaDataToGeoJson = (
    areaData: AreaData,
    locationType: "CIRCLE" | "POLYGON",
  ): GeoJSON | null => {
    if (locationType === "CIRCLE" && areaData.data) {
      return {
        center: {
          lat: areaData.data.center.lat,
          lng: areaData.data.center.lng,
        },
        radius: areaData.data.radius,
      };
    } else if (locationType === "POLYGON" && areaData.points) {
      return {
        points: areaData.points.map((point) => ({
          lat: point.lat,
          lng: point.lng,
        })),
      };
    }
    return null;
  };

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

    // 활동 일자 검증
    if (!activityDate) {
      newErrors.activityDate = "활동 일자를 선택해주세요.";
    }

    // 최대 모집 인원 검증
    if (!maxParticipants.trim()) {
      newErrors.maxParticipants = "최대 모집 인원을 입력해주세요.";
    } else {
      const participants = parseInt(maxParticipants);
      if (isNaN(participants) || participants < 1) {
        newErrors.maxParticipants = "최대 모집 인원은 1명 이상이어야 합니다.";
      }
    }

    if (date && time) {
      const selectedDateTime = new Date(`${date}T${time}:00`);
      const currentDateTime = new Date();

      if (selectedDateTime <= currentDateTime) {
        newErrors.datetime =
          "마감 날짜와 시간은 현재 시간보다 이후여야 합니다.";
      }
    }

    // 활동 영역 검증
    if (!areaData || !locationType) {
      newErrors.area = "활동영역을 설정해주세요.";
    }

    // 활동일과 마감일 검증
    if (activityDate && date && time) {
      const activityDateTime = new Date(`${activityDate}T10:00:00`);
      const deadlineDateTime = new Date(`${date}T${time}:00`);

      if (deadlineDateTime.getTime() >= activityDateTime.getTime()) {
        newErrors.datetime = "신청 마감일은 활동일보다 이전이어야 합니다.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 이미 제출 중이거나 제출 완료된 경우 중복 제출 방지
    if (isSubmitting || isSubmitted) {
      console.log("이미 제출 중이거나 제출 완료되었습니다.");
      return;
    }

    // 기존 요청이 있다면 취소
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    // 새로운 AbortController 생성
    const abortController = new AbortController();
    currentRequestRef.current = abortController;

    setIsSubmitting(true);

    // async 함수를 별도로 정의하고 호출
    const submitForm = async () => {
      try {
        // 유효성 검사
        if (!areaData || !locationType) {
          alert("활동 지역을 설정해주세요.");
          return;
        }

        // 백엔드 API에 맞는 데이터 구조로 변환
        const locationGeojson = convertAreaDataToGeoJson(
          areaData,
          locationType,
        );
        if (!locationGeojson) {
          alert("지역 데이터를 변환하는 중 오류가 발생했습니다.");
          return;
        }

        const requestData: GreenTeamPostCreateRequest = {
          title: title.trim(),
          content: description.trim(),
          locationType: locationType,
          locationGeojson: locationGeojson,
          maxParticipants: parseInt(maxParticipants),
          eventDate: formatDateTime(activityDate, "10:00"), // 기본 시간 설정
          deadlineAt: formatDateTime(date, time),
        };

        // 이미지 파일 추출
        const imageFiles: File[] = images.map((imageData) => imageData.file);

        // 요청이 취소되었는지 확인
        if (abortController.signal.aborted) {
          console.log("요청이 취소되었습니다.");
          return;
        }

        // API 호출
        const response = await createGreenTeamPost(
          requestData,
          imageFiles,
          abortController.signal,
        );

        // 요청이 취소되었는지 다시 확인 (응답을 받은 후)
        if (abortController.signal.aborted) {
          console.log("요청이 취소되었습니다.");
          return;
        }

        console.log("모집글이 성공적으로 생성되었습니다. ID:", response.id);

        // 성공 상태 설정
        setIsSubmitted(true);

        // 성공 시 게시글 목록 페이지로 이동
        void navigate("/post");
      } catch (error) {
        // AbortError는 의도적인 취소이므로 에러로 처리하지 않음
        if (error instanceof Error && error.name === "AbortError") {
          console.log("요청이 취소되었습니다.");
          return;
        }

        console.error("모집글 생성 중 오류가 발생했습니다:", error);
        // 에러 처리 - 사용자에게 알림
        alert("모집글 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        // 요청이 완료되었으므로 ref 초기화
        if (currentRequestRef.current === abortController) {
          currentRequestRef.current = null;
        }
        setIsSubmitting(false);
      }
    };

    void submitForm();
  };

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

  const handleActivityDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivityDate(e.target.value);
    if (errors.activityDate) {
      setErrors((prev) => ({ ...prev, activityDate: "" }));
    }
  };

  const handleMaxParticipantsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    // 숫자만 입력 허용
    if (value === "" || /^\d+$/.test(value)) {
      setMaxParticipants(value);
      if (errors.maxParticipants) {
        setErrors((prev) => ({ ...prev, maxParticipants: "" }));
      }
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

          {/* 활동 일자 및 최대 모집 인원 */}
          <div className="create-post-form-group">
            <div className="create-post-form-row">
              <div className="create-post-form-group create-post-form-half">
                <Label className="create-post-label">활동 일자 *</Label>
                <Input
                  id="activityDate"
                  type="date"
                  value={activityDate}
                  onChange={handleActivityDateChange}
                  className={`create-post-input ${errors.activityDate ? "error" : ""}`}
                  min={getCurrentDate()}
                />
                {errors.activityDate && (
                  <span className="create-post-error">
                    {errors.activityDate}
                  </span>
                )}
              </div>
              <div className="create-post-form-group create-post-form-half">
                <Label className="create-post-label">최대 모집 인원 *</Label>
                <Input
                  id="maxParticipants"
                  type="text"
                  placeholder="예: 10"
                  value={maxParticipants}
                  onChange={handleMaxParticipantsChange}
                  className={`create-post-input ${errors.maxParticipants ? "error" : ""}`}
                />
                {errors.maxParticipants && (
                  <span className="create-post-error">
                    {errors.maxParticipants}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 활동영역 설정  */}
          <div className="create-post-form-group">
            <CreateMapArea onAreaChange={handleAreaChange} />
            {errors.area && (
              <span className="create-post-error">{errors.area}</span>
            )}
          </div>

          <div className="create-post-buttons">
            <Button
              type="button"
              className="create-post-cancel"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="create-post-submit"
              disabled={isSubmitting || isSubmitted}
            >
              {isSubmitted
                ? "작성 완료됨"
                : isSubmitting
                  ? "작성 중..."
                  : "작성 완료"}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePost;
