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
  comments: Comment[];
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
    endDate: "2025-09-10",
    activityDate: "2025-09-15",
    images: ["/src/mocks/images/cacao.jpg"],
    maxParticipants: 10,
    participants: 3,
    areaData: {
      type: "polygon",
      points: [
        { lat: 37.5665, lng: 126.978 }, // 서울 시청 근처
        { lat: 37.567, lng: 126.9785 },
        { lat: 37.5675, lng: 126.9775 },
        { lat: 37.566, lng: 126.977 },
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
        center: { lat: 37.5665, lng: 126.978 }, // 서울 시청
        radius: 500, // 500미터 반경
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
    endDate: "2025-09-15",
    activityDate: "2025-09-25",
    images: [],
    maxParticipants: 5,
    participants: 5,
    areaData: {
      type: "polygon",
      points: [
        { lat: 37.564, lng: 126.975 }, // 명동 근처
        { lat: 37.565, lng: 126.976 },
        { lat: 37.5645, lng: 126.977 },
        { lat: 37.5635, lng: 126.976 },
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
        center: { lat: 37.5705, lng: 126.981 }, // 경복궁 근처
        radius: 300, // 300미터 반경
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
        { lat: 37.569, lng: 126.985 }, // 인사동 근처
        { lat: 37.57, lng: 126.986 },
        { lat: 37.5695, lng: 126.987 },
        { lat: 37.5685, lng: 126.9865 },
        { lat: 37.568, lng: 126.9855 },
      ],
    },
    comments: [], // 댓글이 없는 게시물
  },
  {
    id: 6,
    publisher_id: "test_creator",
    publisher_image: "/src/mocks/images/profile.jpg",
    title: "폴리곤 영역 저장 테스트",
    description: "실제 작성한 위치와 같게 나오는지 테스트",
    date: "2025-08-27",
    time: "00:59",
    endDate: "2025-08-30",
    activityDate: "2025-08-30",
    images: [],
    maxParticipants: 123,
    participants: 0,
    areaData: {
      type: "polygon",
      points: [
        { lat: 37.564231334994055, lng: 126.99045650208022 },
        { lat: 37.563967697176665, lng: 126.98964647495772 },
        { lat: 37.563414905175655, lng: 126.9908320113423 },
        { lat: 37.56415054285883, lng: 126.99156157219436 },
      ],
    },
    comments: [],
  },
  {
    id: 7,
    publisher_id: "circle_tester",
    publisher_image: "/src/mocks/images/profile.jpg",
    title: "원 영역 저장 테스트",
    description: "실제 작성한 위치와 같게 나오는지 테스트",
    date: "2025-08-31",
    time: "04:03",
    endDate: "2025-09-10",
    activityDate: "2025-09-10",
    images: [],
    maxParticipants: 10,
    participants: 0,
    areaData: {
      type: "circle",
      data: {
        center: {
          lat: 36.61029738127031,
          lng: 127.28513401351398
        },
        radius: 392.24111263876654
      }
    },
    comments: [],
  },
];
