import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import "../styles/Community.css";

const MAX_IMAGES = 5;
const MAX_MB = 1;
const TITLE_MAX = 20;
const CONTENT_MAX = 500;

export default function CommunityNew() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [titleErr, setTitleErr] = useState<string | null>(null);
  const [contentErr, setContentErr] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (v.length > TITLE_MAX) {
      setTitleErr(`제목은 최대 ${TITLE_MAX}자까지 입력할 수 있어요.`);
      v = v.slice(0, TITLE_MAX);
    } else {
      setTitleErr(null);
    }
    setTitle(v);
  };

  const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let v = e.target.value;
    if (v.length > CONTENT_MAX) {
      setContentErr(`내용은 최대 ${CONTENT_MAX}자까지 입력할 수 있어요.`);
      v = v.slice(0, CONTENT_MAX);
    } else {
      setContentErr(null);
    }
    setContent(v);
  };

  const pickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    const remain = Math.max(0, MAX_IMAGES - files.length);
    if (remain === 0) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있어요.`);
      e.target.value = "";
      return;
    }
    const clipped = selected.slice(0, remain);
    const overSize = clipped.filter((f) => f.size > MAX_MB * 1024 * 1024);
    if (overSize.length) {
      alert(`파일당 최대 ${MAX_MB}MB 까지만 업로드 가능합니다.`);
    }

    const safe = clipped.filter((f) => f.size <= MAX_MB * 1024 * 1024);
    if (safe.length === 0) {
      e.target.value = "";
      return;
    }

    setFiles((prev) => [...prev, ...safe]);
    setPreviews((prev) => [
      ...prev,
      ...safe.map((f) => URL.createObjectURL(f)),
    ]);

    e.target.value = "";
  };

  const isInvalid =
    title.trim().length === 0 ||
    content.trim().length === 0 ||
    !!titleErr ||
    !!contentErr;

  const removeImage = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => {
      const url = prev[idx];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || isInvalid) return;

    setSubmitting(true);
    try {
      // 실제 API 붙일 땐 FormData로..
      // 더미 처리
      await new Promise((r) => setTimeout(r, 600));
      alert("작성 완료(더미)");
      void navigate("/community");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="community-page">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>

      <main className="community-container">
        <form className="new-card" onSubmit={void onSubmit} noValidate>
          <h2 className="new-title">커뮤니티 글 작성</h2>

          <div className="new-field">
            <label className="new-label">제목</label>
            <input
              className={`new-input ${titleErr ? "is-error" : ""}`}
              placeholder="제목을 입력하세요"
              value={title}
              onChange={onChangeTitle}
              maxLength={TITLE_MAX + 5}
              disabled={submitting}
              aria-invalid={!!titleErr}
            />
            <div className="new-help">
              <span className="new-counter">
                {title.length}/{TITLE_MAX}
              </span>
              {titleErr && <span className="new-error">{titleErr}</span>}
            </div>
          </div>

          <div className="new-field">
            <label className="new-label">내용</label>
            <textarea
              className={`new-textarea ${contentErr ? "is-error" : ""}`}
              placeholder="내용을 입력하세요"
              value={content}
              onChange={onChangeContent}
              rows={8}
              maxLength={CONTENT_MAX + 20}
              disabled={submitting}
              aria-invalid={!!contentErr}
            />
            <div className="new-help">
              <span className="new-counter">
                {content.length}/{CONTENT_MAX}
              </span>
              {contentErr && <span className="new-error">{contentErr}</span>}
            </div>
          </div>

          <div className="new-field">
            <div className="new-label-row">
              <label className="new-label">
                이미지 첨부 (최대 {MAX_IMAGES}개)
              </label>
              <span className="new-count">
                {files.length}/{MAX_IMAGES}
              </span>
            </div>

            <div className="new-upload-row">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={pickImages}
                disabled={submitting || files.length >= MAX_IMAGES}
              />
              <button
                type="button"
                className="new-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting || files.length >= MAX_IMAGES}
              >
                이미지 선택
              </button>
              <span className="new-hint">파일당 최대 {MAX_MB}MB</span>
            </div>

            {previews.length > 0 && (
              <ul className="new-preview-grid">
                {previews.map((url, i) => (
                  <li key={url} className="new-preview-item">
                    <img src={url} alt={`preview-${i}`} />
                    <button
                      type="button"
                      className="new-remove-thumb"
                      onClick={() => removeImage(i)}
                      aria-label="이미지 삭제"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="new-actions">
            <button
              type="button"
              className="new-btn ghost"
              onClick={() => void navigate(-1)}
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="new-btn primary"
              disabled={submitting || isInvalid}
              aria-busy={submitting}
            >
              {submitting ? "작성중…" : "작성완료"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
