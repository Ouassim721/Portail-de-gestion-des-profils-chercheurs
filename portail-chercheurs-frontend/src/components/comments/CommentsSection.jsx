import { useState, useEffect, useContext } from "react";
import axios from "../../axios";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { AuthContext } from "../../contexts/AuthContext"; // pour user.id
import { LanguageContext } from "../../contexts/LanguageContext";

export default function CommentsSection({ publicationId }) {
  const { t } = useContext(LanguageContext);
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`/publications/${publicationId}/comments`)
      .then(({ data }) => setComments(data))
      .catch(console.error);
  }, [publicationId]);

  function handleAdd(text) {
    axios
      .post("/comments", { publication_id: publicationId, contenu: text })
      .then(({ data }) => setComments([data, ...comments]))
      .catch(console.error);
  }

  function handleUpdate(id, text) {
    axios
      .put(`/comments/${id}`, { contenu: text })
      .then(({ data }) => {
        setComments(comments.map((c) => (c.id === id ? data : c)));
        setEditingId(null);
      })
      .catch(console.error);
  }

  function handleDelete(id) {
    axios
      .delete(`/comments/${id}`)
      .then(() => setComments(comments.filter((c) => c.id !== id)))
      .catch(console.error);
  }

  return (
    <div className="mt-6 border-t pt-4 border-[var(--color-text-primary)]">
      <h4 className="font-semibold mb-3 text-[var(--color-text-primary)]">
        {t("commentsTitle")}
      </h4>
      <CommentForm
        onSubmit={handleAdd}
        submitLabel={t("postCommentButton")}
      />
      <CommentList
        comments={comments}
        editingId={editingId}
        onEdit={setEditingId}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        currentUserId={user?.id}
      />
    </div>
  );
}
