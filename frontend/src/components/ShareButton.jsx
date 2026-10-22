import { useState } from "react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

export default function ShareButton({ project }) {
  const { user } = useAuth();
  const [isPublic, setIsPublic] = useState(project.isPublic);
  const [shareId, setShareId] = useState(project.shareId);
  const [error, setError] = useState("");

  // Sirf owner ko ye button dikhega
  if (project.owner._id !== user._id) return null;

  const toggle = async () => {
    setError("");
    try {
      const { data } = await api.patch(`/api/projects/${project._id}/share`);
      setIsPublic(data.isPublic);
      setShareId(data.shareId); // backend ka naya shareId
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const link = `${window.location.origin}/public/${shareId}`;

  return (
    <div style={{ margin: "8px 0" }}>
      <button onClick={toggle}>
        {isPublic ? "🔒 Make private" : "🌐 Make public"}
      </button>
      {isPublic && shareId && (
        <p>
          Public link: <a href={link} target="_blank" rel="noreferrer">{link}</a>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
