import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const errMsg = (err) => err.response?.data?.message || "Something went wrong";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/projects");
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/projects", body);
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

export const addMember = createAsyncThunk(
  "projects/addMember",
  async ({ id, email }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${id}/members`, { email });
      return data;
    } catch (err) {
      return rejectWithValue(errMsg(err));
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: { items: [], current: null, loading: false, error: null },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload;
      })
      // one project
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add member
      .addCase(addMember.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = null;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;