import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import "../styles/Community.css";

import {
  listPosts,
  getPost,
  listComments,
  toggleLike,
  createComment,
} from "../services/community";

type PostListItem = {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  user: { id: number; nickname: string; profileImageUrl?: string };
  images?: { id: number; imageUrl: string }[];
  liked?: boolean;
};
type PostDetail = PostListItem & { images: { id: number; imageUrl: string }[] };
type CommentItem = {
  id: number;
  user: { id: number; nickname: string; profileImageUrl?: string };
  content: string;
  createdAt: string;
};

const PAGE_SIZE = 6;

export default function Community() {
  const [items, setItems] = useState<PostListItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [booted, setBooted] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentInput, setCommentInput] = useState("");

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (loading) return;
      if (!hasNext && page !== 0) return;
      setLoading(true);
      try {
        const res = await listPosts({ page, size: PAGE_SIZE });
        if (!cancelled) {
          setItems((prev) =>
            page === 0 ? res.items : [...prev, ...res.items],
          );
          setHasNext(res.hasNext);
          if (!booted && page === 0) setBooted(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!booted) return;
    if (!hasNext || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setPage((p) => p + 1);
        });
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [booted, hasNext, loading]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const openModal = async (postId: number) => {
    const detail = await getPost(postId);
    const cmts = await listComments(postId);
    setSelected(detail);
    setComments(cmts);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    setComments([]);
    setCommentInput("");
  };

  const onToggleLike = async (postId: number) => {
    const { likeCount, liked } = await toggleLike(postId);
    setItems((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likeCount, liked } : p)),
    );
    setSelected((prev) =>
      prev && prev.id === postId ? { ...prev, likeCount, liked } : prev,
    );
  };

  const onSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || commentInput.trim().length === 0) return;
    const newCmt = await createComment(selected.id, { content: commentInput });
    setComments((prev) => [newCmt, ...prev]);
    setCommentInput("");
  };

  // ✅ 캐러셀
  function ImageCarousel({
    images,
    kind = "card",
    onClickInside,
  }: {
    images: { id: number; imageUrl: string }[];
    kind?: "card" | "modal";
    onClickInside?: (e: React.MouseEvent) => void;
  }) {
    const [idx, setIdx] = useState(0);
    const wClass = kind === "card" ? "carousel card" : "carousel modal";
    if (!images || images.length === 0) return null;

    const go = (d: number) => {
      setIdx((p) => (p + d + images.length) % images.length);
    };

    return (
      <div className={wClass} onClick={onClickInside}>
        <div className="carousel-viewport">
          <img
            key={images[idx].id}
            src={images[idx].imageUrl}
            alt=""
            className="carousel-img"
            loading="lazy"
          />
          {images.length > 1 && (
            <>
              <button
                className="carousel-arrow left"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="이전 이미지"
              >
                ‹
              </button>
              <button
                className="carousel-arrow right"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="다음 이미지"
              >
                ›
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="carousel-dots">
            {images.map((img, i) => (
              <button
                key={img.id}
                className={`dot ${i === idx ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                aria-label={`${i + 1}번 이미지로 이동`}
              />
            ))}
          </div>
        )}
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
        <div className="compose-wrap">
          <Link to="/community/new" className="compose-btn">
            새 게시물 작성
          </Link>
        </div>

        {!booted && <div className="loading">로딩 중…</div>}

        {items.map((p) => (
          <article
            key={p.id}
            className="post-card"
            onClick={() => {
              void openModal(p.id);
            }}
            role="button"
          >
            <div className="post-header">
              <img
                src={p.user.profileImageUrl || "/default-avatar.png"}
                alt=""
                className="avatar"
              />
              <div className="meta">
                <span className="nickname">{p.user.nickname}</span>
                <span className="dot">·</span>
                <time className="date">{fmt(p.createdAt)}</time>
              </div>
            </div>

            <h3 className="post-title">{p.title}</h3>

            {p.images?.length ? (
              <ImageCarousel
                images={p.images}
                kind="card"
                onClickInside={(e) => e.stopPropagation()}
              />
            ) : null}

            <div
              className="post-actions"
              onClick={(e) => e.stopPropagation()}
              role="group"
            >
              <button
                className={`act-btn ${p.liked ? "liked" : ""}`}
                onClick={() => {
                  void onToggleLike(p.id);
                }}
                aria-pressed={!!p.liked}
                aria-label={p.liked ? "좋아요 취소" : "좋아요"}
              >
                {p.liked ? "❤️" : "🤍"}{" "}
                <span className="count">{p.likeCount}</span>
              </button>
              <div className="act-sep" />
              <button
                className="act-btn"
                onClick={() => {
                  void openModal(p.id);
                }}
              >
                💬 <span className="count">{p.commentCount}</span>
              </button>
            </div>
          </article>
        ))}

        <div ref={sentinelRef} style={{ height: 1 }} />

        {loading && booted && <div className="loading">로딩 중…</div>}
        {!loading && booted && items.length === 0 && (
          <div className="empty">아직 게시물이 없습니다.</div>
        )}
        {!hasNext && booted && items.length > 0 && (
          <div className="end-tip">마지막 게시물입니다.</div>
        )}
      </main>

      {open && selected && (
        <div className="cm-modal" onClick={closeModal} role="dialog" aria-modal>
          <div
            className="cm-modal-body"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <button className="cm-close" onClick={closeModal} aria-label="닫기">
              ×
            </button>

            <header className="cm-post-header">
              <img
                src={selected.user.profileImageUrl || "/default-avatar.png"}
                alt=""
                className="avatar"
              />
              <div className="meta">
                <span className="nickname">{selected.user.nickname}</span>
                <span className="dot">·</span>
                <time className="date">{fmt(selected.createdAt)}</time>
              </div>
            </header>

            <h2 className="cm-title">{selected.title}</h2>
            {selected.content && (
              <p className="cm-content">{selected.content}</p>
            )}

            {selected.images?.length > 0 && (
              <div className="cm-images">
                {selected.images?.length ? (
                  <ImageCarousel images={selected.images} kind="modal" />
                ) : null}
              </div>
            )}

            <div className="cm-actions">
              <button
                className={`act-btn ${selected.liked ? "liked" : ""}`}
                onClick={() => {
                  void onToggleLike(selected.id);
                }}
                aria-pressed={!!selected.liked}
                aria-label={selected.liked ? "좋아요 취소" : "좋아요"}
              >
                {selected.liked ? "❤️" : "🤍"}{" "}
                <span className="count">{selected.likeCount}</span>
              </button>
              <div className="act-sep" />
              <span className="act-btn">
                💬 <span className="count">{selected.commentCount}</span>
              </span>
            </div>

            <section className="cm-comments">
              <h3 className="cm-sec-title">댓글</h3>
              <form
                className="cm-reply"
                onSubmit={(e) => {
                  void onSubmitComment(e);
                }}
              >
                <input
                  className="cm-input"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="댓글을 입력하세요…"
                  maxLength={100}
                />
                <button className="cm-reply-btn" type="submit">
                  댓글 작성
                </button>
              </form>

              <ul className="cm-comment-list">
                {comments.map((c) => (
                  <li key={c.id} className="cm-comment">
                    <img
                      src={c.user.profileImageUrl || "/default-avatar.png"}
                      alt=""
                      className="avatar sm"
                    />
                    <div className="cbox">
                      <div className="cmeta">
                        <span className="nickname">{c.user.nickname}</span>
                        <span className="dot">·</span>
                        <time className="date">{fmt(c.createdAt)}</time>
                      </div>
                      <p className="ctext">{c.content}</p>
                    </div>
                  </li>
                ))}
                {comments.length === 0 && (
                  <li className="cm-empty">첫 댓글을 작성해 보세요!</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
