import { useDispatch, useSelector } from "react-redux";
import { askAI } from "../features/ai/aiSlice";

export default function AIButton({ type, label, text }) {
  const dispatch = useDispatch();
  const { loading, activeType } = useSelector((state) => state.ai);

  const isThisLoading = loading && activeType === type;

  return (
    <button
      onClick={() => dispatch(askAI({ type, text }))}
      disabled={loading || !text.trim()}
    >
      {isThisLoading ? "Thinking..." : `✨ ${label}`}
    </button>
  );
}