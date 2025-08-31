import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import "../styles/Profile.css";

type Activity = {
  id: number;
  title: string;
  description: string;
  participatedAt: string; // YYYY-MM-DD
  participants: number;
  status: "진행중" | "완료";
};

type CommunityPost = {
  id: number;
  title: string;
  excerpt: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  user: { id: number; nickname: string; profileImageUrl?: string };
  thumbnailUrls?: string[];
};

type ProfileData = {
  id: number;
  nickname: string;
  profileImageUrl?: string;
  bio?: string;
  joinedAt: string;
  isOwner: boolean;
  isDeleted: boolean;
  activities: Activity[];
  posts: CommunityPost[];
};

/*  mock API */
function fetchProfile(userId: string): Promise<ProfileData> {
  return Promise.resolve({
    id: Number(userId) || 1,
    nickname: "환경지킴이",
    profileImageUrl: "",
    bio: "지구를 사랑하는 환경 운동가입니니다. 작은 실천으로 큰 변화를 만들어가요! 🌱",
    joinedAt: "2023-03-15",
    isOwner: true,
    isDeleted: false,
    activities: [
      {
        id: 1,
        title: "한강 플로깅 모임",
        description: "한강에서 함께 달리며 쓰레기 줍기",
        participatedAt: "2024-01-15",
        participants: 25,
        status: "완료",
      },
      {
        id: 2,
        title: "도시 텃밭 가꾸기",
        description: "도심 속 작은 텃밭 프로젝트",
        participatedAt: "2024-01-10",
        participants: 12,
        status: "진행중",
      },
      {
        id: 3,
        title: "재활용품 분리수거 캠페인",
        description: "올바른 분리수거 방법 알리기",
        participatedAt: "2023-12-20",
        participants: 45,
        status: "완료",
      },
      {
        id: 4,
        title: "해변 정화 활동",
        description: "바다 쓰레기 줍기",
        participatedAt: "2023-11-15",
        participants: 30,
        status: "완료",
      },
    ],
    posts: [
      {
        id: 101,
        title: "제로웨이스트 생활 한 달 후기",
        excerpt: "한 달 실천 후기...",
        createdAt: "2024-01-20",
        likeCount: 32,
        commentCount: 8,
        user: { id: 1, nickname: "환경지킴이" },
      },
      {
        id: 102,
        title: "우리 동네 플라스틱 프리 카페 추천",
        excerpt: "일회용품 없는 카페 소개",
        createdAt: "2024-01-18",
        likeCount: 28,
        commentCount: 12,
        user: { id: 1, nickname: "환경지킴이" },
        thumbnailUrls: ["", ""],
      },
      {
        id: 103,
        title: "DIY 친환경 세제 만들기",
        excerpt: "집에서 쉽게 만드는 레시피",
        createdAt: "2024-01-15",
        likeCount: 45,
        commentCount: 15,
        user: { id: 1, nickname: "환경지킴이" },
        thumbnailUrls: [""],
      },
      {
        id: 104,
        title: "친환경 포장재 사용 후기",
        excerpt: "사용 후기",
        createdAt: "2024-01-12",
        likeCount: 22,
        commentCount: 6,
        user: { id: 1, nickname: "환경지킴이" },
      },
    ],
  });
}

function requestWithdraw(): Promise<boolean> {
  return Promise.resolve(true);
}

const d = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

/* 활동 아이템*/
const ActivityItem: React.FC<{ item: Activity; onClick?: () => void }> = ({
  item,
  onClick,
}) => (
  <button className="pf-activity" onClick={onClick}>
    {/* LEFT */}
    <div className="pf-activity-left">
      <div className="pf-activity-title">{item.title}</div>
      <div className="pf-activity-desc">{item.description}</div>
      <div className="pf-activity-date">
        <i className="pf-ico pf-ico-calendar" />
        참여일: {item.participatedAt}
      </div>
    </div>

    {/* RIGHT */}
    <div className="pf-activity-right">
      <span
        className={`pf-badge ${
          item.status === "진행중" ? "pf-badge--green" : "pf-badge--blue"
        }`}
      >
        {item.status}
      </span>
      <div className="pf-activity-people">
        <i className="pf-ico pf-ico-user" />
        {item.participants}명 참여
      </div>
    </div>
  </button>
);

/*  페이지  */
export default function Profile() {
  const { userId = "me" } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchProfile(userId)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [userId]);

  const activities = useMemo(
    () =>
      (data?.activities ?? [])
        .slice()
        .sort((a, b) => (a.participatedAt < b.participatedAt ? 1 : -1)),
    [data?.activities],
  );

  const posts = useMemo(
    () =>
      (data?.posts ?? [])
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [data?.posts],
  );

  if (loading) return <div className="pf-loading">로딩 중…</div>;
  if (!data) return <div className="pf-loading">데이터가 없습니다.</div>;

  if (data.isDeleted) {
    return (
      <div className="pf-deleted">
        <button className="pf-back" onClick={() => void navigate(-1)}>
          ← 뒤로가기
        </button>
        <div className="pf-deleted-box">탈퇴한 유저입니다.</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>

      <main className="pf-wrap">
        <button className="pf-back" onClick={() => void navigate(-1)}>
          ← 뒤로가기
        </button>

        {/* 상단 프로필 카드 */}
        <div className="pf-card pf-head">
          <div className="pf-avatar">
            {data.profileImageUrl ? (
              <img
                src={data.profileImageUrl}
                alt={`${data.nickname}님의 프로필 이미지`}
                className="pf-avatar-img"
              />
            ) : (
              <div className="pf-avatar-skeleton" />
            )}
          </div>
          <div className="pf-head-info">
            <div className="pf-nickname">{data.nickname}</div>
            <div className="pf-bio">
              {data.bio || "소개가 아직 없어요. 자기소개를 작성해주세요."}
            </div>
            <div className="pf-joined">📅 {d(data.joinedAt)} 가입</div>
          </div>
        </div>

        {/* 참여한 환경 활동 */}
        <section className="pf-section">
          <div className="pf-sec-head">
            <div className="pf-sec-title">
              참여한 환경 활동 ({activities.length})
            </div>
            <button
              className="pf-more"
              onClick={() => void navigate(`/users/${data.id}/activities`)}
            >
              더보기 ▸
            </button>
          </div>

          <div className="pf-sec-body">
            <div className="pf-activity-list">
              {activities.map((a) => (
                <ActivityItem
                  key={a.id}
                  item={a}
                  onClick={() => void navigate(`/post/${a.id}`)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 작성한 커뮤니티 글 */}
        <section className="pf-section">
          <div className="pf-sec-head">
            <div className="pf-sec-title">
              작성한 커뮤니티 글 ({posts.length})
            </div>
            <button
              className="pf-more"
              onClick={() => void navigate(`/users/${data.id}/community`)}
            >
              더보기 ▸
            </button>
          </div>

          <div className="pf-sec-body">
            <div className="pf-post-grid">
              {posts.map((p) => (
                <article
                  key={p.id}
                  className="pf-post-card"
                  onClick={() => void navigate(`/community/${p.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <h3 className="pf-post-title">{p.title}</h3>
                  <p className="pf-post-excerpt">{p.excerpt}</p>

                  {p.thumbnailUrls?.length ? (
                    <div className="pf-post-thumbs">
                      {p.thumbnailUrls.slice(0, 2).map((url, i) => (
                        <img
                          key={`${url}-${i}`}
                          src={url || "/default-thumb.png"}
                          alt={`${p.title} 썸네일 ${i + 1}`}
                          className="pf-thumb-img"
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="pf-post-foot">
                    <span>{d(p.createdAt)}</span>
                    <div className="pf-post-stats">
                      <span className="pf-stat">
                        <i className="pf-ico-like" /> {p.likeCount}
                      </span>
                      <span className="pf-stat">
                        <i className="pf-ico-comment" /> {p.commentCount}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        {data.isOwner && (
          <div className="pf-withdraw-wrap">
            <button
              className="pf-withdraw"
              onClick={() => {
                void (async () => {
                  if (
                    !window.confirm(
                      "정말 탈퇴하시겠어요?\n커뮤니티 글/댓글은 삭제되고, 환경 활동 기록은 ‘탈퇴한 유저’로 표시되어 남습니다.",
                    )
                  ) {
                    return;
                  }
                  try {
                    const ok = await requestWithdraw();
                    if (ok) {
                      alert("탈퇴가 완료되었습니다.");
                      void navigate("/");
                    }
                  } catch (error) {
                    console.error("회원 탈퇴 실패:", error);
                    alert("탈퇴 처리 중 오류가 발생했습니다.");
                  }
                })();
              }}
            >
              회원탈퇴
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
