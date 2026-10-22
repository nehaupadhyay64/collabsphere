import { memo } from "react";
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project._id}`}
      style={{
        display: "block",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 14,
        marginBottom: 10,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <h3 style={{ margin: 0 }}>{project.title}</h3>
      <p style={{ margin: "6px 0" }}>{project.description || "No description"}</p>
      <small>Owner: {project.owner?.name}</small>
    </Link>
  );
}

export default memo(ProjectCard);