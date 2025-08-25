import { useEffect, useRef, useState } from "react";
import "../styles/ChatWidget.css";
import { sendChat, type ChatMessage } from "@/api/chat";
import { getErrorMessage, isAbortError } from "@/lib/http-error";
import Markdown from "@/components/Markdown";

type Msg = ChatMessage & { id: string };
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: uid(), role: "assistant", content: "무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);
  // 언마운트 시 진행 중 요청 취소
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);

    const userMsg: Msg = { id: uid(), role: "user", content: text };
    const history: ChatMessage[] = [...messages, userMsg].map(
      ({ role, content }) => ({ role, content }),
    );
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);
    try {
      const { reply } = await sendChat(
        history,
        abortControllerRef.current.signal,
      );
      const botMsg: Msg = { id: uid(), role: "assistant", content: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      if (!isAbortError(err)) setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <>
      {!open && (
        <button
          className="gm-chat-fab"
          type="button"
          aria-label="챗봇 열기"
          onClick={() => setOpen(true)}
        >
          🗯️
        </button>
      )}

      {open && (
        <section className="gm-chat-panel" aria-label="Green mAI 챗봇">
          <header className="gm-chat-header">
            <strong>Green mAIt와 대화</strong>
            <button
              className="gm-chat-close"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              type="button"
            >
              ×
            </button>
          </header>

          <div className="gm-chat-list" ref={listRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`gm-chat-msg ${m.role === "user" ? "is-user" : "is-bot"}`}
              >
                {m.role === "assistant" ? (
                  <Markdown className="gm-chat-bubble">{m.content}</Markdown>
                ) : (
                  <div className="gm-chat-bubble">{m.content}</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="gm-chat-msg is-bot">
                <div className="gm-chat-bubble gm-typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
          </div>

          {error && <div className="gm-chat-error">에러: {error}</div>}

          <footer className="gm-chat-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message..."
              disabled={loading}
              rows={2}
            />
            <button
              className="gm-send"
              onClick={() => void handleSend()}
              disabled={loading || !input.trim()}
              type="button"
            >
              전송
            </button>
          </footer>
        </section>
      )}
    </>
  );
}
