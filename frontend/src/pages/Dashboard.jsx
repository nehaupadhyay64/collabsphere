import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
  clearError,
} from "../features/projects/projectsSlice";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.projects);
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await dispatch(createProject(form));
    if (createProject.fulfilled.match(result)) {
      setForm({ title: "", description: "" });
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "30px auto", padding: "0 16px" }}>
        <h2>My Projects</h2>

        <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
          <input
            name="title"
            placeholder="Project title"
            value={form.title}
            onChange={handleChange}
            required
          />{" "}
          <input
            name="description"
            placeholder="Short description"
            value={form.description}
            onChange={handleChange}
          />{" "}
          <button>+ Create</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <Spinner />}
        {!loading && items.length === 0 && <p>No projects here.</p>}

        {items.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </>
  );
}