import { useEffect, useRef, useState } from "react";
import "../styles/Education.css";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import RecycleInfoModal from "../components/RecycleInfoModal";
import Footer from "../components/Footer";
import { fetchRecyclingEduPosts, type BackendPost } from "@/api/recyclingEdu";
import axios from "axios";

type RecycleItem = { title: string; image: string; content: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getStringProp(obj: unknown, key: string): string | undefined {
  if (isRecord(obj) && typeof obj[key] === "string") {
    return obj[key];
  }
  return undefined;
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const serverMsg = getStringProp(err.response?.data, "message");
    return serverMsg ?? (err.message || "요청에 실패했습니다.");
  }
  const msg = getStringProp(err, "message");
  if (msg) return msg;
  return "알 수 없는 오류가 발생했습니다.";
}

function isAbortedError(err: unknown): boolean {
  const name = getStringProp(err, "name");
  const message = getStringProp(err, "message");
  return (
    (err instanceof DOMException && err.name === "AbortError") ||
    name === "CanceledError" ||
    message === "canceled"
  );
}

function toRecycleItem(p: BackendPost): RecycleItem {
  return {
    title: p.title ?? `게시글 ${p.id}`,
    image: p.imageUrl || "/recycle-placeholder.png",
    content: p.content,
  };
}

const Education = () => {
  const [items, setItems] = useState<RecycleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<RecycleItem | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const list = await fetchRecyclingEduPosts(controller.signal);
        setItems(list.map(toRecycleItem));
      } catch (err: unknown) {
        if (!isAbortedError(err)) setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedItem && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
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

        {loading && <div>불러오는 중…</div>}
        {error && <div className="error">에러: {error}</div>}

        {!loading && !error && (
          <div className="recycle-grid">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="recycle-card"
                onClick={() => setSelectedItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" ? setSelectedItem(item) : undefined
                }
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <p>{item.title}</p>
              </div>
            ))}
            {!items.length && <div>게시글이 없습니다.</div>}
          </div>
        )}

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

      <Footer />
    </div>
  );
};

export default Education;
