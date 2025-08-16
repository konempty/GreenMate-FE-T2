import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import "../styles/Community.css";

const MAX_IMAGES = 5;
const MAX_MB = 10;

export default function CommunityNew() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const pickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    const remain = Math.max(0, MAX_IMAGES - files.length);
    const clipped = selected.slice(0, remain);

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
    if (submitting) return;

    if (title.trim().length === 0) return alert("제목을 입력해 주세요.");
    if (content.trim().length === 0) return alert("내용을 입력해 주세요.");

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
        <form className="new-card" onSubmit={void onSubmit}>
          <h2 className="new-title">커뮤니티 글 작성</h2>

          <div className="new-field">
            <label className="new-label">제목</label>
            <input
              className="new-input"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              disabled={submitting}
            />
          </div>

          <div className="new-field">
            <label className="new-label">내용</label>
            <textarea
              className="new-textarea"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              maxLength={2000}
              disabled={submitting}
            />
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
              disabled={submitting}
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
