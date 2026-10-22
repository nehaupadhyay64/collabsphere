import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles } from "../features/files/filesSlice";
import FileUploader from "../components/FileUploader";
import FilePreview from "../components/FilePreview";
import Spinner from "../components/Spinner";

export default function FilesTab() {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.files);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchFiles(projectId));
    setSelectedId(null);
  }, [dispatch, projectId]);

  const selectedFile = items.find((f) => f._id === selectedId);

  return (
    <div>
      <FileUploader projectId={projectId} />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <Spinner />}
      {!loading && items.length === 0 && <p>No files yet.</p>}

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: 260 }}>
          {items.map((file) => (
            <div
              key={file._id}
              onClick={() => setSelectedId(file._id)}
              style={{
                padding: 10,
                marginBottom: 8,
                borderRadius: 6,
                cursor: "pointer",
                border: "1px solid #ccc",
                background: file._id === selectedId ? "#e8f0fe" : "transparent",
              }}
            >
              <b>{file.originalName}</b>
              <br />
              <small>
                {(file.size / 1024).toFixed(1)} KB · {file.uploadedBy?.name}
              </small>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {selectedFile ? (
            <FilePreview key={selectedFile._id} file={selectedFile} />
          ) : (
            <p>Select a file to preview.</p>
          )}
        </div>
      </div>
    </div>
  );
}