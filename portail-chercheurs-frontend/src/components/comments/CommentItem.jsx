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
    <li 
      className="p-4 rounded-lg shadow-sm flex justify-between items-start"
      style={{ backgroundColor: 'var(--color-white)' }}>
      <div>
        <p className="text-[var(--color-text-primary)]">{comment.contenu}</p>
        <small className="text-xs text-[var(--color-text-secondary)]">
          Le {new Date(comment.created_at).toLocaleString("fr-FR")}
        </small>
      </div>
      {canModify && (
        <div className="flex flex-col gap-2">
          <Button 
            icon={faEdit} 
            variant="ghost" 
            onClick={onEdit}
            iconColor="var(--color-primary)"
          />
          <Button 
            icon={faTrash} 
            variant="ghost" 
            onClick={() => onDelete(comment.id)}
            iconColor="var(--color-secondary)"
          />
        </div>
      )}
    </li>
  );
}