import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../features/notes/notesSlice";
import NoteItem from "../components/NoteItem";
import NoteEditor from "../components/NoteEditor";
import Spinner from "../components/Spinner";

export default function NotesTab() {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.notes);
  const [selected, setSelected] = useState(null); // null | "new" | noteId

  useEffect(() => {
    dispatch(fetchNotes(projectId));
    setSelected(null);
  }, [dispatch, projectId]);

  // useCallback: NoteItem (memo) ko har render par naya function na mile
  const handleSelect = useCallback((id) => setSelected(id), []);

  const handleSave = async ({ title, content }) => {
    if (selected === "new") {
      const result = await dispatch(createNote({ projectId, title, content }));
      if (createNote.fulfilled.match(result)) setSelected(result.payload._id);
    } else {
      await dispatch(updateNote({ id: selected, title, content }));
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteNote(selected));
    if (deleteNote.fulfilled.match(result)) setSelected(null);
  };

  const selectedNote = items.find((n) => n._id === selected);

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 240 }}>
        <button onClick={() => setSelected("new")} style={{ marginBottom: 10 }}>
          + New Note
        </button>
        {loading && <Spinner />}
        {!loading && items.length === 0 && <p>No notes yet.</p>}
        {items.map((note) => (
          <NoteItem
            key={note._id}
            note={note}
            active={note._id === selected}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {selected ? (
          <NoteEditor
            key={selected}
            note={selectedNote}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ) : (
          <p>Select a note or create a new one.</p>
        )}
      </div>
    </div>
  );
}