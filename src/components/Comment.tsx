import React, { useState, useEffect, useCallback } from "react";
import "../styles/Comment.css";

interface Comment {
  id: number;
  content: string;
  author: string;
  authorImage: string;
  createdAt: string;
  imageUrl?: string;
}

interface CommentProps {
  postId: number;
  currentUserId: string;
  initialComments?: Comment[];
  onCommentAdd?: (comment: Comment) => void;
}

const Comment: React.FC<CommentProps> = ({
  postId,
  currentUserId,
  initialComments = [],
  onCommentAdd,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentInput, setCommentInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 댓글 저장
  const saveCommentsToStorage = useCallback(
    (newComments: Comment[]) => {
      const commentsKey = `comments_${postId}`;
      localStorage.setItem(commentsKey, JSON.stringify(newComments));
    },
    [postId],
  );

  useEffect(() => {
    try {
      const commentsKey = `comments_${postId}`;
      const savedComments = localStorage.getItem(commentsKey);

      if (savedComments) {
        // 로컬 스토리지에 저장된 댓글이 있으면 사용
        setComments(JSON.parse(savedComments) as Comment[]);
      } else if (initialComments.length > 0) {
        // 없으면 초기 댓글 사용하고 로컬 스토리지에 저장
        setComments(initialComments);
        saveCommentsToStorage(initialComments);
      }
    } catch (error) {
      console.error(error);
      setComments(initialComments);
    }
  }, [postId, initialComments, saveCommentsToStorage]);

  // 이미지 업로드 처리
  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 댓글 작성
  const onSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    const hasText = commentInput.trim().length > 0;
    const hasImage = !!previewUrl;
    if (!hasText && !hasImage) return;

    if (submitting) return;
    setSubmitting(true);

    try {
      // 새 댓글 생성
      const newComment: Comment = {
        id: Date.now(),
        content: commentInput.trim(),
        author: currentUserId,
        authorImage: "./images/profile.jpg", // 현재 사용자 프로필 이미지
        createdAt: new Date().toISOString(),
        imageUrl: previewUrl || undefined,
      };

      const newComments = [newComment, ...comments];
      setComments(newComments);
      saveCommentsToStorage(newComments);

      // 부모 컴포넌트에 알림
      onCommentAdd?.(newComment);

      setCommentInput("");
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <section className="comment-section">
      <h3 className="comment-section-title">댓글 ({comments.length})</h3>

      {/* 댓글 리스트 */}
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <img
              src={comment.authorImage}
              alt={comment.author}
              className="comment-avatar"
            />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-dot">·</span>
                <time className="comment-date">
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              {comment.content && (
                <div className="comment-text">{comment.content}</div>
              )}
              {comment.imageUrl && (
                <div className="comment-image">
                  <img src={comment.imageUrl} alt="첨부 이미지" />
                </div>
              )}
            </div>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="comment-empty">첫 댓글을 작성해 보세요!</li>
        )}
      </ul>

      {/* 댓글 작성 폼 */}
      <form className="comment-form" onSubmit={(e) => void onSubmitComment(e)}>
        <div className="comment-form-row">
          <textarea
            placeholder="댓글을 입력하세요…"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            maxLength={500}
            disabled={submitting}
            className="comment-textarea"
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
            id={`commentImage-${postId}`}
            style={{ display: "none" }}
            onChange={onPickImage}
            disabled={submitting}
          />
          <label
            htmlFor={`commentImage-${postId}`}
            className="img-upload-btn"
            aria-disabled={submitting}
            style={
              submitting ? { opacity: 0.6, pointerEvents: "none" } : undefined
            }
          >
            📷
          </label>
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={submitting || (!commentInput.trim() && !previewUrl)}
          >
            {submitting ? "작성 중…" : "댓글 작성"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Comment;
