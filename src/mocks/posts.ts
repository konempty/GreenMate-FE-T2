import type { AreaData } from "../types/mapArea";

export interface Comment {
  id: number;
  content: string;
  author: string;
  authorImage: string;
  createdAt: string;
  imageUrl?: string;
}

export interface Post {
  id: number;
  publisher_id: string;
  publisher_image: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endDate: string;
  activityDate: string;
  images: string[];
  maxParticipants: number;
  participants: number;
  areaData: AreaData;
  comments: Comment[]; // 댓글 추가
}

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    publisher_id: "greenmate_user01",
    publisher_image: "/src/mocks/images/profile.jpg",
    title: "제목1",
    description: "테스트",
    date: "2025-08-01",
    time: "12:23",
    endDate: "2025-08-10",
    activityDate: "2025-08-15",
    images: ["/src/mocks/images/cacao.jpg"],
    maxParticipants: 10,
    participants: 3,
    areaData: {
      type: "polygon",
      points: [
        { x: 278, y: 63.78125 },
        { x: 156, y: 174.78125 },
        { x: 410, y: 268.78125 },
        { x: 497, y: 83.78125 },
      ],
    },
    comments: [
      {
        id: 1,
        content: "좋은 활동이네요! 참여하고 싶습니다.",
        author: "eco_lover99",
        authorImage: "/src/mocks/images/profile.jpg",
        createdAt: "2025-08-01T15:30:00.000Z",
      },
      {
        id: 2,
        content: "시간이 맞으면 저도 함께 하겠습니다.",
        author: "green_earth",
        authorImage: "/src/mocks/images/profile.jpg",
        createdAt: "2025-08-01T16:45:00.000Z",
      },
    ],
  },
  {
    id: 2,
    publisher_id: "eco_warrior",
    publisher_image: "/src/mocks/images/profile.jpg",
    title: "제목2",
    description:
      "테스트 내용이 얼마나 길어져도 되는지 확인하기 위한 테스트입니다.",
    date: "2025-08-02",
    time: "14:00",
    endDate: "2025-08-12",
    activityDate: "2025-08-20",
    images: ["/src/mocks/images/calendar.jpg", "/src/mocks/images/recycle.jpg"],
    maxParticipants: 20,
    participants: 19,
    areaData: {
      type: "circle",
      data: {
        center: { x: 316.5, y: 91.78125 },
        radius: 180.88670487352022,
      },
    },
    comments: [
      {
        id: 3,
        content: "정말 의미있는 활동입니다!",
        author: "nature_friend",
        authorImage: "/src/mocks/images/profile.jpg",
        createdAt: "2025-08-02T10:20:00.000Z",
        imageUrl: "/src/mocks/images/recycle.jpg",
      },
      {
        id: 4,
        content: "저도 참여할게요 😊",
        author: "clean_world",
        authorImage: "/src/mocks/images/profile.jpg",
        createdAt: "2025-08-02T11:15:00.000Z",
      },
      {
        id: 5,
        content: "환경을 위한 좋은 일이네요. 응원합니다!",
        author: "earth_saver",
        authorImage: "/src/mocks/images/profile.jpg",
        createdAt: "2025-08-02T12:30:00.000Z",
      },
    ],
  },
  {
    id: 3,
    publisher_id: "nature_lover",
    publisher_image: "/src/mocks/images/profile.jpg",
    title: "제목3",
    description:
      "얼마나 길어질 수 있는지 확인하기 위한 테스트입니다. " +
      "이 내용은 실제로는 짧지만, 테스트를 위해 길게 작성되었습니다.",
    date: "2025-08-03",
    time: "16:30",
    endDate: "2025-08-15",
    activityDate: "2025-08-25",
    images: [],
    maxParticipants: 5,
    participants: 5,
    areaData: {
      type: "polygon",
      points: [
        { x: 200, y: 100 },
        { x: 300, y: 150 },
        { x: 250, y: 250 },
        { x: 150, y: 200 },
      ],
    },
    comments: [
      {
        id: 6,
        content: "벌써 모집이 완료되었군요. 다음에는 꼭 참여하고 싶습니다.",
        author: "late_joiner",
        authorImage: "/src/mocks/images/profile.jpg",
        createdAt: "2025-08-03T18:45:00.000Z",
      },
    ],
  },
  {
    id: 4,
    publisher_id: "clean_earth",
    publisher_image: "/src/mocks/images/profile.jpg",
    title: "제목4",
    description:
      "더더욱 길어지는 내용입니다. 이 글은 테스트를 위해 작성된 것으로, " +
      "실제로는 이렇게 길지 않습니다. 하지만, 다양한 상황을 시뮬레이션하기 위해 길게 작성되었습니다.",
    date: "2025-08-04",
    time: "18:00",
    endDate: "2025-08-20",
    activityDate: "2025-08-30",
    images: ["/src/mocks/images/cigarette.jpg"],
    maxParticipants: 15,
    participants: 8,
    areaData: {
      type: "circle",
      data: {
        center: { x: 400, y: 200 },
        radius: 120.5,
      },
    },
    comments: [
      {
        id: 7,
        content: "활동 장소가 어디인가요?",
        author: "curious_user",
        authorImage: "/src/mocks/images/profile.jpg",
        createdAt: "2025-08-04T19:30:00.000Z",
      },
      {
        id: 8,
        content: "저도 참여하고 싶습니다! 준비물이 따로 있나요?",
        author: "eager_volunteer",
        authorImage: "/src/mocks/images/profile.jpg",
        createdAt: "2025-08-04T20:15:00.000Z",
      },
    ],
  },
  {
    id: 5,
    publisher_id: "green_volunteer",
    publisher_image: "/src/mocks/images/profile.jpg",
    title: "제목도 길어지면 어떻게 될까? 궁금해서 작성해본 제목",
    description: "테스트",
    date: "2025-08-05",
    time: "20:30",
    endDate: "2025-08-25",
    activityDate: "2025-09-01",
    images: [
      "/src/mocks/images/trash.jpg",
      "/src/mocks/images/cacao.jpg",
      "/src/mocks/images/calendar.jpg",
      "/src/mocks/images/recycle.jpg",
    ],
    maxParticipants: 30,
    participants: 0,
    areaData: {
      type: "polygon",
      points: [
        { x: 100, y: 50 },
        { x: 200, y: 100 },
        { x: 180, y: 180 },
        { x: 80, y: 150 },
        { x: 50, y: 100 },
      ],
    },
    comments: [], // 댓글이 없는 게시물
  },
];
