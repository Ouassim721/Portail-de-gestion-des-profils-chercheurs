import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
  editingId,
  onEdit,
  onUpdate,
  onDelete,
  currentUserId,
}) {
  return (
    <ul className="space-y-4 mt-4">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          isEditing={editingId === c.id}
          onEdit={() => onEdit(c.id)}
          onUpdate={onUpdate}
          onCancel={() => onEdit(null)}
          onDelete={onDelete}
          canModify={c.chercheur_id === currentUserId}
        />
      ))}
    </ul>
  );
}
