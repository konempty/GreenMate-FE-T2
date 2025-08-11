export type UserDto = {
  id: number;
  nickname: string;
  profileImageUrl?: string;
};

export type CommunityImageDto = {
  id: number;
  imageUrl: string;
};

export type CommunityListItemDto = {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  user: UserDto;
  images?: CommunityImageDto[];
  liked?: boolean;
};

export type CommunityDetailDto = CommunityListItemDto & {
  images: CommunityImageDto[];
  liked?: boolean;
};

export type CommentDto = {
  id: number;
  user: UserDto;
  content: string;
  createdAt: string;
  imageUrl?: string;
};

// ---- Mock DB ----
const likeCountMap = new Map<number, number>();
const likedSet = new Set<number>();

const MOCK_POSTS: CommunityDetailDto[] = [
  {
    id: 101,
    title: "아이고",
    content: "화이팅..",
    likeCount: 2,
    commentCount: 1,
    createdAt: new Date().toISOString(),
    user: {
      id: 1,
      nickname: "jameswebb",
      profileImageUrl:
        "https://easy-peasy.ai/_next/image?url=https%3A%2F%2Fmedia.easy-peasy.ai%2Fea726477-e66b-4c73-bcbd-8efcdf91df1b%2F9c3e73e5-b967-40bb-8d30-01abe8470cb4.png&w=828&q=75",
    },
    images: [
      { id: 1, imageUrl: "/images/comm1.jpg" },
      { id: 2, imageUrl: "/images/comm2.jpg" },
      { id: 3, imageUrl: "/images/comm3.jpg" },
    ],
  },
  {
    id: 102,
    title: "오늘 청소 인증",
    content: "공원 청소하고 왔습니다!",
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: {
      id: 2,
      nickname: "konempty",
      profileImageUrl:
        "https://s3.amazonaws.com/video-api-ai/system/tool/talking_head/66c44c6120398.png",
    },
    images: [{ id: 4, imageUrl: "/images/comm2.jpg" }],
  },
];

const MOCK_COMMENTS: Record<number, CommentDto[]> = {
  101: [
    {
      id: 9001,
      user: {
        id: 3,
        nickname: "venus",
        profileImageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT38iD4kByF8ptLv0RLoLdUj26nMiP0fUCe3ppoyg7-sy8BD6Xm6ZPqxLccaylpeVIA3hg&usqp=CAU",
      },
      content: "와 포스터 깔끔해요!",
      createdAt: new Date().toISOString(),
    },
  ],
  102: [],
};

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---- API (mock) ----
export async function listPosts(params: {
  page: number;
  size: number;
}): Promise<{ items: CommunityListItemDto[]; hasNext: boolean }> {
  await delay();
  const start = params.page * params.size;
  const end = start + params.size;
  const slice = MOCK_POSTS.slice(start, end).map((p) => {
    const likeOverride = likeCountMap.get(p.id);
    return {
      ...p,
      likeCount: likeOverride ?? p.likeCount,
      liked: likedSet.has(p.id),
      images: p.images,
    };
  });
  const hasNext = end < MOCK_POSTS.length;
  return { items: slice, hasNext };
}

export async function getPost(id: number): Promise<CommunityDetailDto> {
  await delay();
  const found = MOCK_POSTS.find((p) => p.id === id);
  if (!found) throw new Error("not found");
  const overrides = likeCountMap.get(id);
  return {
    ...found,
    likeCount: overrides ?? found.likeCount,
    liked: likedSet.has(id),
  };
}

export async function listComments(communityId: number): Promise<CommentDto[]> {
  await delay();
  return [...(MOCK_COMMENTS[communityId] ?? [])];
}

export async function toggleLike(
  communityId: number,
): Promise<{ likeCount: number; liked: boolean }> {
  await delay(150);
  const post = MOCK_POSTS.find((p) => p.id === communityId);
  if (!post) throw new Error("not found");

  const current = likeCountMap.get(communityId) ?? post.likeCount;

  if (likedSet.has(communityId)) {
    likedSet.delete(communityId);
    const next = Math.max(0, current - 1);
    likeCountMap.set(communityId, next);
    return { likeCount: next, liked: false };
  } else {
    likedSet.add(communityId);
    const next = current + 1;
    likeCountMap.set(communityId, next);
    return { likeCount: next, liked: true };
  }
}

export async function createComment(
  communityId: number,
  body: { content: string; imageUrl?: string },
): Promise<CommentDto> {
  await delay(200);
  const newCmt: CommentDto = {
    id: Math.floor(Math.random() * 1_000_000),
    user: { id: 999, nickname: "me", profileImageUrl: "/avatar-me.png" },
    content: body.content,
    createdAt: new Date().toISOString(),
    imageUrl: body.imageUrl, // ← 저장
  };
  const arr = MOCK_COMMENTS[communityId] ?? (MOCK_COMMENTS[communityId] = []);
  arr.unshift(newCmt);
  const post = MOCK_POSTS.find((p) => p.id === communityId);
  if (post) post.commentCount += 1;
  return newCmt;
}
