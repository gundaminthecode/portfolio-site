import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  contactEmail?: string; 
  title?: string;
};

export default function ContactModal({ open, onClose, contactEmail = "nmath2211@outlook.com", title = "Contact Me" }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // very small focus trap
        const root = dialogRef.current;
        if (!root) return;
        const f = Array.from(root.querySelectorAll<HTMLElement>("button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])"))
          .filter(el => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
        if (f.length === 0) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const message = String(fd.get("message") || "");
    setStatus("sending");

    try {
      // Simple fallback: open the user's mail client prefilled
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="contact-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-title" onClick={onOverlayClick}>
      <div className="contact-panel app-divs" ref={dialogRef}>
        <header className="contact-header">
          <h2 id="contact-title">{title}</h2>
          <button type="button" className="contact-close" onClick={onClose} aria-label="Close">×</button>
        </header>

        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            Name
            <input ref={firstFieldRef} name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Message
            <textarea name="message" rows={5} required />
          </label>

          <div className="contact-actions">
            <button type="submit" className="btn" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send"}</button>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          </div>

          <p className="contact-hint">This will open your mail app.</p>
        </form>
      </div>
    </div>
  );
}