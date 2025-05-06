import { useState } from "react";
import Button from "../ui/Button";
export default function CommentForm({
  initialValue = "",
  submitLabel = "Envoyer",
  onSubmit,
  onCancel,
}) {
  const [text, setText] = useState(initialValue);

  const handle = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-2 mb-4">
      <textarea
        className="w-full border rounded p-2 text-[var(--color-text-primary)]"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrire un commentaire..."
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="neutral" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button>{submitLabel}</Button>
      </div>
    </form>
  );
}
