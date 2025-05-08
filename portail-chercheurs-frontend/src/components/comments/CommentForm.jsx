import { useState, useContext } from "react";
import Button from "../ui/Button";
import { LanguageContext } from "../../contexts/LanguageContext";

export default function CommentForm({
  initialValue = "",
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const { t } = useContext(LanguageContext);
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
        placeholder={t("addCommentPlaceholder")}
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="neutral" onClick={onCancel}>
            {t("cancelButton")}
          </Button>
        )}
        <Button>
          {submitLabel || t("postCommentButton")}
        </Button>
      </div>
    </form>
  );
}
