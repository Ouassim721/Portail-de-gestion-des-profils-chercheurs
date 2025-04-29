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
    <li className="bg-white p-4 rounded shadow-sm flex justify-between items-start">
      <div>
        <p className="text-gray-800">{comment.contenu}</p>
        <small className="text-xs text-gray-500">
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
          />
          <Button
            icon={faTrash}
            variant="outline"
            size="sm"
            onClick={() => onDelete(comment.id)}
          />
        </div>
      )}
    </li>
  );
}
