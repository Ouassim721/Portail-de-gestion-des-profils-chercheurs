import { useState } from "react";

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
        className="w-full border rounded p-2"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrire un commentaire..."
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            className="px-3 py-1 border rounded"
            onClick={onCancel}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-1 bg-blue-600 text-white rounded"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
