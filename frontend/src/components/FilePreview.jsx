import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import api from "../services/api";
import AIButton from "./AIButton";
import { clearResult } from "../features/ai/aiSlice";

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
const getExt = (name) => name.slice(name.lastIndexOf(".")).toLowerCase();

export default function FilePreview({ file }) {
  const dispatch = useDispatch();
  const { result, error: aiError } = useSelector((state) => state.ai);

  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isImage = IMAGE_EXTS.includes(getExt(file.originalName));

  useEffect(() => {
    dispatch(clearResult()); // purana AI jawab hatao
    let cancelled = false;
    let objectUrl = null;

    const request = isImage
      ? api.get(`/files/${file._id}/download`, { responseType: "blob" }).then((res) => {
          if (cancelled) return;
          objectUrl = URL.createObjectURL(res.data);
          setImageUrl(objectUrl);
        })
      : api.get(`/files/${file._id}/content`).then((res) => {
          if (!cancelled) setText(res.data.content);
        });

    request
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Could not load file");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl); // memory free
    };
  }, [dispatch, file._id, isImage]);

  if (loading) return <p>Loading preview...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h4>{file.originalName}</h4>

      {isImage ? (
        <img src={imageUrl} alt={file.originalName} style={{ maxWidth: "100%", borderRadius: 6 }} />
      ) : (
        <>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 10,
              borderRadius: 6,
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            {text}
          </pre>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <AIButton type="explain" label="Explain this code" text={text} />
            <AIButton type="docs" label="Generate docs" text={text} />
          </div>

          {aiError && <p style={{ color: "red" }}>{aiError}</p>}
          {result && (
            <div style={{ background: "#f3f0ff", padding: 12, borderRadius: 6, marginTop: 10 }}>
              <b>🤖 Gemini says:</b>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </>
      )}
    </div>
  );
}