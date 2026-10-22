import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// type = "explain" | "improve" | "docs" | "readme"
export const askAI = createAsyncThunk(
  "ai/ask",
  async ({ type, text }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/gemini/${type}`, { text });
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "AI request failed");
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState: { result: "", loading: false, error: null, activeType: null },
  reducers: {
    clearResult(state) {
      state.result = "";
      state.error = null;
      state.activeType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askAI.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.result = "";
        state.activeType = action.meta.arg.type;
      })
      .addCase(askAI.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(askAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResult } = aiSlice.actions;
export default aiSlice.reducer;
