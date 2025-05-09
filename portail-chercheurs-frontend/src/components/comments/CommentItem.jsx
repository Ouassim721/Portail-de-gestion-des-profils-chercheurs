import { useState } from "react";
import CommentForm from "./CommentForm";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

export default function CommentItem({
  comment,
  isEditing,
  onEdit,
  onUpdate,
  onCancel,
  onDelete,
  canModify,
}) {
  const [text, setText] = useState(comment.contenu);

  if (isEditing) {
    return (
      <CommentForm
        initialValue={text}
        submitLabel="Enregistrer"
        onSubmit={(val) => onUpdate(comment.id, val)}
        onCancel={onCancel}
      />
    );
  }

  return (
    <li className="bg-[var(--color-bg-primary)] p-4 rounded shadow-sm flex justify-between items-start">
      <div>
        <p className="text-[var(--color-text-primary)]">{comment.contenu}</p>
        <small className="text-xs text-[var(--color-gray)]">
          Le {new Date(comment.created_at).toLocaleString("fr-FR")}
        </small>
      </div>
      {canModify && (
        <div className="flex flex-col gap-2 text-sm">
          <Button
            icon={faEdit}
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="text-blue-500"
          />
 <Button
  icon={faTrash}
  variant="outline"
  size="sm"
  onClick={() => {
    if (window.confirm("Supprimer ce commentaire ?")) {
      onDelete(comment.id);
    }
  }}
  className="text-red-500"
/>
        </div>
      )}
    </li>
  );
}
