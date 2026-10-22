import { memo } from "react";

function NoteItem({ note, active, onSelect }) {
  return (
    <div
      onClick={() => onSelect(note._id)}
      style={{
        padding: 10,
        marginBottom: 8,
        borderRadius: 6,
        cursor: "pointer",
        border: "1px solid #ccc",
        background: active ? "#e8f0fe" : "transparent",
      }}
    >
      <b>{note.title}</b>
      <br />
      <small>
        by {note.author?.name} · {new Date(note.updatedAt).toLocaleDateString()}
      </small>
    </div>
  );
}

export default memo(NoteItem);