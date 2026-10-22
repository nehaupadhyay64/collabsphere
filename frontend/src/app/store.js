import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "../features/projects/projectsSlice";
import notesReducer from "../features/notes/notesSlice";
import filesReducer from "../features/files/filesSlice";
import aiReducer from "../features/ai/aiSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    notes: notesReducer,
    files: filesReducer,
    ai: aiReducer,
  },
});