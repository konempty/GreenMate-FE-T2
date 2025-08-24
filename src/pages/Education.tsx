import { useEffect, useState } from "react";
import "../styles/Education.css";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import RecycleInfoModal from "../components/RecycleInfoModal";
import Footer from "../components/Footer";
import { fetchRecyclingEduPosts, type BackendPost } from "@/api/recyclingEdu";
import { getErrorMessage, isAbortError } from "@/lib/http-error";

type RecycleItem = {
  id: number | string;
  title: string;
  image: string;
  content: string;
};

function toRecycleItem(p: BackendPost): RecycleItem {
  return {
    id: p.id,
    title: p.title ?? `게시글 ${p.id}`,
    image: p.imageUrl || "/recycle-placeholder.png",
    content: p.content,
  };
}

export default function Education() {
  const [items, setItems] = useState<RecycleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<RecycleItem | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const list = await fetchRecyclingEduPosts(controller.signal);
        setItems(list.map(toRecycleItem));
      } catch (err: unknown) {
        if (!isAbortError(err)) setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  return (
    <div className="recycle-page">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>

      <main className="recycle-container">
        <h2 className="recycle-title">분리수거 학습</h2>

        {loading && <div>불러오는 중…</div>}
        {error && !loading && <div className="error">에러: {error}</div>}

        {!loading && !error && (
          <div className="recycle-grid">
            {items.map((item) => (
              <button
                key={item.id}
                className="recycle-card"
                onClick={() => setSelectedItem(item)}
                type="button"
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <p>{item.title}</p>
              </button>
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
}
