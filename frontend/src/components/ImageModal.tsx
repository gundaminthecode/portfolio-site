import ReactDOM from "react-dom";
import '../styles/image-modal.css'

type Props = {
  src: string;
  alt?: string;
  open: boolean;
  onClose: () => void;
};

export default function ImageModal({ src, alt, open, onClose }: Props) {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="image-modal-backdrop" onClick={onClose}>
      <div className="image-modal-content" onClick={e => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>×</button>
        <img src={src} alt={alt} />
      </div>
    </div>,
    document.body
  );
}