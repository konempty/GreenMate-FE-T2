import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PageNavigation } from "../components/PageNavigation";
import Button from "../components/Button";
import { MOCK_POSTS } from "../mocks/posts";
import type { Post } from "../mocks/posts";

import "../styles/DetailPost.css";

const DetailPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post: Post | undefined = MOCK_POSTS.find((p) => p.id === Number(id));

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

          {/* 이미지 섹션 추가 */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DetailPost;
