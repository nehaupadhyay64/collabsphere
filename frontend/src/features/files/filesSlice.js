import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const errMsg = (err) => err.response?.data?.message || "Something went wrong";

export const fetchFiles = createAsyncThunk(
  "files/fetchAll",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/files`);
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

export const uploadFile = createAsyncThunk(
  "files/upload",
  async ({ projectId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post(`/api/projects/${projectId}/files`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
  
);

const filesSlice = createSlice({
  name: "files",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default filesSlice.reducer;
