import { useReducer, useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadFile } from "../features/files/filesSlice";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const initialState = { status: "idle", file: null, error: "" };

function uploadReducer(state, action) {
  switch (action.type) {
    case "SELECT":
      return { status: "idle", file: action.file, error: "" };
    case "START":
      return { ...state, status: "uploading", error: "" };
    case "SUCCESS":
      return { status: "success", file: null, error: "" };
    case "ERROR":
      return { ...state, status: "error", error: action.error };
    default:
      return state;
  }
}

export default function FileUploader({ projectId }) {
  const dispatch = useDispatch();
  const [state, localDispatch] = useReducer(uploadReducer, initialState);
  const inputRef = useRef(null);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      localDispatch({ type: "ERROR", error: "File is too large (max 2MB)" });
      return;
    }
    localDispatch({ type: "SELECT", file });
  };

  const handleUpload = async () => {
    localDispatch({ type: "START" });
    const result = await dispatch(uploadFile({ projectId, file: state.file }));
    if (uploadFile.fulfilled.match(result)) {
      localDispatch({ type: "SUCCESS" });
      inputRef.current.value = ""; // input khali karo
    } else {
      localDispatch({ type: "ERROR", error: result.payload });
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input ref={inputRef} type="file" onChange={handleSelect} />{" "}
      <button
        onClick={handleUpload}
        disabled={!state.file || state.status === "uploading"}
      >
        {state.status === "uploading" ? "Uploading..." : "Upload"}
      </button>
      {state.status === "success" && <p style={{ color: "green" }}>Uploaded! ✅</p>}
      {state.status === "error" && <p style={{ color: "red" }}>{state.error}</p>}
    </div>
  );
}