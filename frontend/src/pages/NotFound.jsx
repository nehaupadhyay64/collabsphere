import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}