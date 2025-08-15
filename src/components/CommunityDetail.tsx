import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import "../styles/Community.css";
import {
  getPost,
  listComments,
  toggleLike,
  createComment,
  type CommunityDetailDto,
  type CommentDto,
} from "../services/community";

/** 렌더마다 생성되지 않도록 모듈 최상단으로 이동 */
const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<CommunityDetailDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false); // ⬅️ 중복 제출 방지
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const [detail, cmts] = await Promise.all([
          getPost(Number(id)),
          listComments(Number(id)),
        ]);
        if (cancelled) return;
        setPost(detail);
        setComments(cmts);
      } catch {
        if (cancelled) return;
        setErrorMsg("게시글을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // 댓글 이미지 (더미 업로드)
  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(f));
    }
  };
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onToggleLike = async () => {
    if (!post || likeLoading) return; // 이미 요청 중이면 무시
    setLikeLoading(true);
    try {
      const { likeCount, liked } = await toggleLike(post.id);
      setPost({ ...post, likeCount, liked });
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  const onSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    const hasText = commentInput.trim().length > 0;
    const hasImage = !!previewUrl;
    if (!hasText && !hasImage) return;

    if (submitting) return; // ⬅️ 연타 방지 가드
    setSubmitting(true);

    try {
      const newCmt = await createComment(post.id, {
        content: commentInput,
        imageUrl: previewUrl ?? undefined,
      });

      setComments((prev) => [newCmt, ...prev]);
      setCommentInput("");
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (_e) {
      // 필요하면 토스트 등으로 안내
      console.error(_e);
    } finally {
      setSubmitting(false); // ⬅️ 버튼 다시 활성화
    }
  };

  if (loading) {
    return (
      <div className="community-page">
        <Header />
        <PageNavigation />
        <div className="community-container">
          <div className="loading">로딩 중…</div>
        </div>
      </div>
    );
  }

  if (errorMsg || !post) {
    return (
      <div className="community-page">
        <Header />
        <PageNavigation />
        <div className="community-container">
          <div className="error-box">
            {errorMsg ?? "게시글을 찾을 수 없습니다."}
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button className="back-btn" onClick={() => void navigate(-1)}>
              ← 목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community-page">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>
      <main className="community-container">
        <div className="detail-card">
          <div className="detail-head">
            <div className="detail-left">
              <h1 className="detail-title">{post.title}</h1>
              <time className="detail-date">{fmt(post.createdAt)}</time>
            </div>
            <div className="detail-right">
              <img
                src={post.user.profileImageUrl || "/default-avatar.png"}
                alt=""
                className="avatar lg"
              />
              <span className="detail-nickname">{post.user.nickname}</span>
            </div>
          </div>

          {post.content && <p className="detail-content">{post.content}</p>}

          {post.images?.length > 0 && (
            <div className="detail-images-grid">
              {post.images.map((img) => (
                <img key={img.id} src={img.imageUrl} alt="" />
              ))}
            </div>
          )}

          <div className="post-actions">
            <button
              className={`act-btn ${post.liked ? "liked" : ""}`}
              onClick={() => void onToggleLike()}
              aria-pressed={!!post.liked}
              aria-label={post.liked ? "좋아요 취소" : "좋아요"}
            >
              {post.liked ? "❤️" : "🤍"}{" "}
              <span className="count">{post.likeCount}</span>
            </button>
            <div className="act-sep" />
            <span className="act-btn">
              💬 <span className="count">{comments.length}</span>
            </span>
          </div>

          {/* 댓글 섹션 */}
          <section className="comments-section">
            <h3 className="cm-sec-title">댓글</h3>

            {/* 댓글 목록 */}
            <ul className="comment-list">
              {comments.map((c) => (
                <li key={c.id} className="comment-item">
                  <img
                    src={c.user.profileImageUrl || "/default-avatar.png"}
                    alt=""
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{c.user.nickname}</span>
                      <span className="comment-dot">·</span>
                      <time className="comment-date">{fmt(c.createdAt)}</time>
                    </div>
                    <div className="comment-text">{c.content}</div>
                    {c.imageUrl && (
                      <div className="comment-image">
                        <img src={c.imageUrl} alt="첨부 이미지" />
                      </div>
                    )}
                  </div>
                </li>
              ))}
              {comments.length === 0 && (
                <li className="cm-empty">첫 댓글을 작성해 보세요!</li>
              )}
            </ul>

            {/* 댓글 작성 폼 (전송 중 비활성화) */}
            <form
              className="comment-form"
              onSubmit={(e) => void onSubmitComment(e)}
            >
              <div className="comment-form-row">
                <textarea
                  placeholder="댓글을 입력하세요…"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  maxLength={500}
                  disabled={submitting}
                  aria-disabled={submitting}
                />
              </div>

              {previewUrl && (
                <div className="comment-img-preview">
                  <img src={previewUrl} alt="미리보기" />
                </div>
              )}

              <div className="comment-actions">
                <input
                  type="file"
                  accept="image/*"
                  id="commentImage"
                  style={{ display: "none" }}
                  onChange={onPickImage}
                  disabled={submitting}
                />
                <label
                  htmlFor="commentImage"
                  className="img-upload-btn"
                  aria-disabled={submitting}
                  style={
                    submitting
                      ? { opacity: 0.6, pointerEvents: "none" }
                      : undefined
                  }
                >
                  📷
                </label>
                <button
                  type="submit"
                  className="cm-reply-btn wide"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? "작성 중…" : "댓글 작성"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
