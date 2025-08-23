import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, CalendarDays } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PageNavigation } from "../components/PageNavigation";
import Button from "../components/Button";
import MapArea from "../components/MapArea";
import Comment from "../components/Comment";
import { MOCK_POSTS } from "../mocks/posts";
import type { Post } from "../mocks/posts";

import "../styles/DetailPost.css";

const DetailPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isParticipating, setIsParticipating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 추가

  // 현재 사용자 ID (실제로는 인증 상태에서 가져와야 함)
  const currentUserId = "greenmate_user01"; // 임시로 설정

  const post: Post | undefined = MOCK_POSTS.find((p) => p.id === Number(id));

  useEffect(() => {
    if (post) {
      try {
        // 로컬 스토리지에서 참여 상태 불러오기
        const participationKey = `participation_${currentUserId}_${post.id}`;
        const savedParticipation = localStorage.getItem(participationKey);
        setIsParticipating(savedParticipation === "true");
      } catch (error) {
        console.error(error);
        setIsParticipating(false);
      }
    }
  }, [post, currentUserId]);

  const handleParticipateToggle = async () => {
    // 이미 처리 중이면 무시
    if (isSubmitting || !post) return;

    setIsSubmitting(true);

    try {
      const newParticipationState = !isParticipating;

      // 실제로는 여기서 API 호출

      // API 호출 시뮬레이션 (실제로는 제거)
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsParticipating(newParticipationState);

      // 로컬 스토리지에 참여 상태 저장
      const participationKey = `participation_${currentUserId}_${post.id}`;
      localStorage.setItem(participationKey, newParticipationState.toString());
    } catch (error) {
      console.error("참가 상태 변경 실패:", error);
      // 에러 발생 시 사용자에게 알림 (toast 등)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="detail-post-container">
        <header className="header">
          <Header />
          <PageNavigation />
        </header>
        <main className="detail-post-main">
          <div className="detail-post-error">
            <h1>게시물을 찾을 수 없습니다.</h1>
            <Button
              onClick={() => {
                void navigate("/post");
              }}
            >
              목록으로 돌아가기
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 현재 참가자 수 계산 (토글 상태에 따라)
  const currentParticipants = isParticipating
    ? post.participants + 1
    : post.participants;

  // 참가 버튼 활성화 조건 체크
  const isPostOwner = currentUserId === post.publisher_id;
  const isMaxCapacityReached = currentParticipants >= post.maxParticipants;
  const isDeadlinePassed = new Date(post.endDate) < new Date();
  const isParticipateDisabled =
    (isMaxCapacityReached && !isParticipating) ||
    isDeadlinePassed ||
    isSubmitting; // 제출 중일 때도 비활성화

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isSubmitting) return isParticipating ? "취소 중..." : "참가 중...";
    if (isDeadlinePassed) return "모집 마감";
    if (isMaxCapacityReached && !isParticipating) return "모집 완료";
    return isParticipating ? "참가 취소" : "참가 하기";
  };

  // 버튼 클래스 결정
  const getButtonClass = () => {
    let baseClass = "detail-post-participate-btn";
    if (isParticipateDisabled) baseClass += " disabled";
    if (isParticipating && !isSubmitting) baseClass += " participating";
    if (isMaxCapacityReached && !isParticipating) baseClass += " full";
    if (isSubmitting) baseClass += " submitting"; // 로딩 상태 클래스 추가
    return baseClass;
  };

  return (
    <div className="detail-post-container">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>

      <main className="detail-post-main">
        <div className="detail-post-content">
          <div className="detail-post-head">
            <h1 className="detail-post-title">{post.title}</h1>
            <div className="detail-post-publisher-info">
              <img
                src={post.publisher_image}
                alt={post.publisher_id}
                className="detail-post-publisher-image"
              />
              <span className="detail-post-publisher-id">
                {post.publisher_id}
              </span>
            </div>
          </div>
          <div className="detail-post-date-info">
            <span className="detail-post-date">
              <Calendar size={16} /> {post.date} {post.time}
            </span>
          </div>

          {/* 이미지 섹션 */}
          {post.images && post.images.length > 0 && (
            <div className="detail-post-images">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`게시물 이미지 ${index + 1}`}
                  className="detail-post-image"
                />
              ))}
            </div>
          )}

          {/* 게시물 내용 */}
          <div className="detail-post-description">
            <p>{post.description}</p>
          </div>

          {/* 활동 영역 */}
          <div className="detail-post-map-section">
            <span className="detail-post-location-label">
              <MapPin size={16} /> 활동 영역
            </span>
            <MapArea
              areaData={post.locationGeojson}
              locationType={post.locationType}
              height={300}
            />
          </div>

          {/* 마감 시간 및 활동 일자 */}
          <div className="detail-post-schedule-info">
            <div className="detail-post-schedule-item">
              <Clock size={16} />
              <span className="detail-post-schedule-label"> 마감 시간: </span>
              <span className="detail-post-schedule-value">{post.endDate}</span>
            </div>
            <div className="detail-post-schedule-item">
              <CalendarDays size={16} />
              <span className="detail-post-schedule-label"> 활동 일자: </span>
              <span className="detail-post-schedule-value">
                {post.activityDate}
              </span>
            </div>
          </div>

          {/* 참가자 정보 및 참가 버튼 */}
          <div className="detail-post-participation">
            <div className="detail-post-participants-info">
              <Users size={20} />
              <span className="detail-post-participants-count">
                참가 중 : {currentParticipants}/{post.maxParticipants}
                {isMaxCapacityReached && (
                  <span className="capacity-status"> (모집완료)</span>
                )}
              </span>
            </div>
            {/* 게시자가 아닐 때만 참가 버튼 표시 */}
            {!isPostOwner && (
              <Button
                onClick={() => void handleParticipateToggle()}
                className={getButtonClass()}
                disabled={isParticipateDisabled}
              >
                {getButtonText()}
              </Button>
            )}
          </div>

          {/* 댓글 섹션 */}
          <Comment
            postId={post.id}
            currentUserId={currentUserId}
            initialComments={post.comments}
            onCommentAdd={(comment) => {
              // 필요시 댓글 추가 시 추가 작업 수행
              console.log("새 댓글 추가됨:", comment);
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetailPost;
