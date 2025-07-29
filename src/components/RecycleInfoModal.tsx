import { useEffect, useRef } from "react";

type RecycleItem = {
  title: string;
  image: string;
  steps: string[];
};

type Props = {
  item: RecycleItem;
  onClose: () => void;
};

const RecycleInfoModal = ({ item, onClose }: Props) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} ref={closeButtonRef}>
          ×
        </button>
        <img src={item.image} alt={item.title} className="modal-image" />
        <h3 id="modal-title" className="modal-title">
          {item.title} 재활용 방법
        </h3>
        <ul className="modal-steps">
          {item.steps.map((step, index) => (
            <li key={index}>
              {index + 1}. {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecycleInfoModal;
