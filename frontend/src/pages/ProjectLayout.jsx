import { useEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "../features/projects/projectsSlice";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import ShareButton from "../components/ShareButton";

export default function ProjectLayout() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  const tabStyle = ({ isActive }) => ({
    marginRight: 16,
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 16px" }}>
        {loading && <Spinner />}
        {error && !current && <p style={{ color: "red" }}>{error}</p>}

        {current && (
          <>
            <h2>{current.title}</h2>
            <p>{current.description}</p>
            <ShareButton key={current._id} project={current} />

            <nav style={{ margin: "16px 0", borderBottom: "1px solid #ccc", paddingBottom: 8 }}>
              <NavLink to="notes" style={tabStyle}>Notes</NavLink>
              <NavLink to="members" style={tabStyle}>Members</NavLink>
              <NavLink to="analytics" style={tabStyle}>Analytics</NavLink>
              <NavLink to="files" style={tabStyle}>Files</NavLink>
              <NavLink to="readme" style={tabStyle}>README</NavLink>
            </nav>

            <Outlet />
          </>
        )}
      </div>
    </>
  );
}