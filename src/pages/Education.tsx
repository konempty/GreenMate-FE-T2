import { useEffect, useRef, useState } from "react";
import "../styles/Education.css";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import RecycleInfoModal from "../components/RecycleInfoModal";

type RecycleItem = {
  title: string;
  image: string;
  steps: string[];
};

const items: RecycleItem[] = [
  {
    title: "유리병",
    image: "src/components/images/glass.jpg",
    steps: [
      "내용물을 비웁니다.",
      "물을 헹굽니다.",
      "라벨을 제거합니다.",
      "분리수거함에 버립니다.",
    ],
  },
  {
    title: "과자봉지",
    image: "src/components/images/snack.jpg",
    steps: [
      "내용물을 비웁니다.",
      "세척이 어렵다면 일반쓰레기로 버립니다.",
      "깨끗이 세척했다면 비닐류로 분리 배출합니다.",
    ],
  },
  {
    title: "음료캔",
    image: "src/components/images/can.jpg",
    steps: [
      "내용물을 비웁니다.",
      "물로 헹굽니다.",
      "가능하다면 압착 후 버립니다.",
    ],
  },
  {
    title: "플라스틱병",
    image: "src/components/images/plastic.jpg",
    steps: [
      "내용물을 비웁니다.",
      "라벨을 제거합니다.",
      "뚜껑을 분리합니다.",
      "가볍게 압축 후 배출합니다.",
    ],
  },
];

const Education = () => {
  const [selectedItem, setSelectedItem] = useState<RecycleItem | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedItem && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem]);

  return (
    <div className="recycle-page">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>

      <main className="recycle-container">
        <h2 className="recycle-title">분리수거 학습</h2>
        <div className="recycle-grid">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="recycle-card"
              onClick={() => setSelectedItem(item)}
            >
              <img src={item.image} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))}
        </div>

        <div className="recycle-tip">
          <span className="material-icons-outlined">info</span>
          <span>
            올바른 분리수거는 환경 보호의 첫 걸음입니다. 각 품목별 재활용 방법을
            숙지하고 실천해주세요. 더 자세한 정보는 환경부 홈페이지를
            참조하세요.
          </span>
        </div>
      </main>

      {selectedItem && (
        <RecycleInfoModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <footer className="footer">
        © 2024 GreenMate. All rights reserved.
      </footer>
    </div>
  );
};

export default Education;
