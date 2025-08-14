import type { AreaData } from "../types/mapArea";

export interface Post {
  id: number;
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
}

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: "제목1",
    description: "테스트",
    date: "2025-08-01",
    time: "12:23",
    endDate: "2025-08-10",
    activityDate: "2025-08-15",
    images: ["/images/test1.jpg"],
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
  },
  {
    id: 2,
    title: "제목2",
    description:
      "테스트 내용이 얼마나 길어져도 되는지 확인하기 위한 테스트입니다.",
    date: "2025-08-02",
    time: "14:00",
    endDate: "2025-08-12",
    activityDate: "2025-08-20",
    images: ["/images/test2.jpg", "/images/test3.jpg"],
    maxParticipants: 20,
    participants: 5,
    areaData: {
      type: "circle",
      data: {
        center: { x: 316.5, y: 91.78125 },
        radius: 180.88670487352022,
      },
    },
  },
  {
    id: 3,
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
    participants: 2,
    areaData: {
      type: "polygon",
      points: [
        { x: 200, y: 100 },
        { x: 300, y: 150 },
        { x: 250, y: 250 },
        { x: 150, y: 200 },
      ],
    },
  },
  {
    id: 4,
    title: "제목4",
    description:
      "더더욱 길어지는 내용입니다. 이 글은 테스트를 위해 작성된 것으로, " +
      "실제로는 이렇게 길지 않습니다. 하지만, 다양한 상황을 시뮬레이션하기 위해 길게 작성되었습니다.",
    date: "2025-08-04",
    time: "18:00",
    endDate: "2025-08-20",
    activityDate: "2025-08-30",
    images: ["/images/test4.jpg"],
    maxParticipants: 15,
    participants: 8,
    areaData: {
      type: "circle",
      data: {
        center: { x: 400, y: 200 },
        radius: 120.5,
      },
    },
  },
  {
    id: 5,
    title: "제목도 길어지면 어떻게 될까? 궁금해서 작성해본 제목",
    description: "테스트",
    date: "2025-08-05",
    time: "20:30",
    endDate: "2025-08-25",
    activityDate: "2025-09-01",
    images: [],
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
  },
];
