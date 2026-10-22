import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import AIButton from "../components/AIButton";
import { clearResult } from "../features/ai/aiSlice";

export default function ReadmeTab() {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.projects);
  const { result, error } = useSelector((state) => state.ai);

  const [overview, setOverview] = useState(
    `Project: ${current.title}\nDescription: ${current.description || ""}`
  );

  useEffect(() => {
    dispatch(clearResult());
  }, [dispatch]);

  return (
    <div>
      <h3>README Generator</h3>
      <p>Write about your project (features, tech stack) and Gemini will generate a README.</p>

      <textarea
        value={overview}
        onChange={(e) => setOverview(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 6 }}
      />
      <br />
      <AIButton type="readme" label="Generate README" text={overview} />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div style={{ background: "#f3f0ff", padding: 12, borderRadius: 6, marginTop: 12 }}>
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}