import { useReducer, useState } from "react";
import ReactMarkdown from "react-markdown";
import useDebounce from "../hooks/useDebounce";

function editorReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

export default function NoteEditor({ note, onSave, onDelete }) {
  const [state, dispatch] = useReducer(editorReducer, {
    title: note?.title || "",
    content: note?.content || "",
  });
  const [saving, setSaving] = useState(false);
  const previewText = useDebounce(state.content, 400);

  const handleChange = (field) => (e) =>
    dispatch({ type: "SET_FIELD", field, value: e.target.value });

  const handleSave = async () => {
    if (!state.title.trim()) return;
    setSaving(true);
    await onSave(state);
    setSaving(false);
  };

  return (
    <div>
      <input
        placeholder="Note title"
        value={state.title}
        onChange={handleChange("title")}
        style={{ width: "100%", marginBottom: 8, padding: 6 }}
      />
      <textarea
        placeholder="Write in Markdown... (# Heading, **bold**, - list)"
        value={state.content}
        onChange={handleChange("content")}
        rows={10}
        style={{ width: "100%", padding: 6, fontFamily: "monospace" }}
      />

      <div style={{ margin: "8px 0" }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>{" "}
        {note?._id && <button onClick={onDelete}>Delete</button>}
      </div>

      <h4>Preview</h4>
      <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 6, minHeight: 60 }}>
        <ReactMarkdown>{previewText || "*Nothing to preview yet*"}</ReactMarkdown>
      </div>
    </div>
  );
}