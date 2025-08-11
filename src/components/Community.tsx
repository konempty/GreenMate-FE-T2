import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import "../styles/Community.css";
import { listPosts, toggleLike } from "../services/community";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

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

function ImageCarousel({
  images,
  kind = "card",
  onImageClick,
}: {
  images: { id: number; imageUrl: string }[];
  kind?: "card" | "modal";
  onImageClick?: () => void;
}) {
  const [idx, setIdx] = useState(0);

  const startX = useRef<number | null>(null);
  const isSwiping = useRef(false);
  const moved = useRef(false);

  const THRESHOLD = 50;

  const goPrev = () => setIdx((p) => (p - 1 + images.length) % images.length);
  const goNext = () => setIdx((p) => (p + 1) % images.length);

  if (!images || images.length === 0) return null;

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    isSwiping.current = true;
    moved.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isSwiping.current || startX.current == null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 6) moved.current = true;
  };

  const endSwipe = (clientX: number) => {
    if (!isSwiping.current || startX.current == null) return;
    const dx = clientX - startX.current;
    if (dx > THRESHOLD) goPrev();
    else if (dx < -THRESHOLD) goNext();
    startX.current = null;
    isSwiping.current = false;
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    endSwipe(e.clientX);
  };
  const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = () => {
    startX.current = null;
    isSwiping.current = false;
  };

  return (
    <div className={kind === "card" ? "carousel card" : "carousel modal"}>
      <div
        className="carousel-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <img
          key={images[idx].id}
          src={images[idx].imageUrl}
          alt=""
          className="carousel-img"
          loading="lazy"
          draggable={false}
          onClick={(e) => {
            if (moved.current) return;
            e.stopPropagation();
            onImageClick?.();
          }}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow left"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="이전 이미지"
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel-arrow right"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
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
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
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

const PAGE_SIZE = 6;

export default function Community() {
  const [items, setItems] = useState<PostListItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [booted, setBooted] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const loadingRef = useRef(loading);
  const hasNextRef = useRef(hasNext);
  const bootedRef = useRef(booted);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    hasNextRef.current = hasNext;
  }, [hasNext]);
  useEffect(() => {
    bootedRef.current = booted;
  }, [booted]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (loadingRef.current) return;
      if (!hasNextRef.current && page !== 0) return;

      setLoading(true);
      try {
        const res = await listPosts({ page, size: PAGE_SIZE });
        if (cancelled) return;

        setItems((prev) => (page === 0 ? res.items : [...prev, ...res.items]));
        setHasNext(res.hasNext);
        if (!bootedRef.current && page === 0) setBooted(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
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

  const onToggleLike = async (postId: number) => {
    const { likeCount, liked } = await toggleLike(postId);
    setItems((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likeCount, liked } : p)),
    );
  };

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
              void navigate(`/community/${p.id}`);
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
                onImageClick={() => {
                  void navigate(`/community/${p.id}`);
                }}
              />
            ) : null}

            <div
              className="post-actions"
              onClick={(e) => e.stopPropagation()}
              role="group"
            >
              <button
                type="button"
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
                type="button"
                className="act-btn"
                onClick={() => {
                  void navigate(`/community/${p.id}`);
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
    </div>
  );
}
