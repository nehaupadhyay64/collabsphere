import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const errMsg = (err) => err.response?.data?.message || "Something went wrong";

export const fetchNotes = createAsyncThunk(
  "notes/fetchAll",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/notes`);
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

export const createNote = createAsyncThunk(
  "notes/create",
  async ({ projectId, title, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/projects/${projectId}/notes`, { title, content });
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/update",
  async ({ id, title, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/notes/${id}`, { title, content });
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/notes/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const i = state.items.findIndex((n) => n._id === action.payload._id);
        if (i !== -1) state.items[i] = action.payload;
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default notesSlice.reducer;
