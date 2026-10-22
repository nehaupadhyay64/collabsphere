import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./routes/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectLayout = lazy(() => import("./pages/ProjectLayout"));
const NotesTab = lazy(() => import("./pages/NotesTab"));
const MembersTab = lazy(() => import("./pages/MembersTab"));
const AnalyticsTab = lazy(() => import("./pages/AnalyticsTab"));
const PublicProject = lazy(() => import("./pages/PublicProject"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FilesTab = lazy(() => import("./pages/FilesTab"));
const ReadmeTab = lazy(() => import("./pages/ReadmeTab"));


export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public/:shareId" element={<PublicProject />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/projects/:id" element={<ProjectLayout />}>
              <Route index element={<Navigate to="notes" replace />} />
              <Route path="notes" element={<NotesTab />} />
              <Route path="members" element={<MembersTab />} />
              <Route path="analytics" element={<AnalyticsTab />} />
              <Route path="files" element={<FilesTab />} />
              <Route path="readme" element={<ReadmeTab />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}