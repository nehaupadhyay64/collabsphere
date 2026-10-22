import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/Spinner";

export default function PublicProject() {
  const { shareId } = useParams();
  const { data, loading, error } = useFetch(`/projects/public/${shareId}`);

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: 60 }}>{error}</p>;

  return (
    <div style={{ maxWidth: 750, margin: "30px auto", padding: "0 16px" }}>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <small>Created by {data.owner} · Read-only page</small>
      <hr />

      <h2>Notes</h2>
      {data.notes.length === 0 && <p>No notes yet.</p>}
      {data.notes.map((note) => (
        <div
          key={note._id}
          style={{ border: "1px solid #ccc", borderRadius: 8, padding: 14, marginBottom: 12 }}
        >
          <h3 style={{ marginTop: 0 }}>{note.title}</h3>
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}