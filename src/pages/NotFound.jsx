import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 16,
    background: "var(--bg)"
  }}>
    <div style={{ fontSize: "4rem" }}>🏁</div>
    <h1 style={{ fontSize: "2rem", color: "var(--primary)", fontWeight: 800 }}>404</h1>
    <p style={{ color: "var(--text-muted)" }}>This page doesn't exist.</p>
    <Link to="/" className="btn btn--primary">Back to Home</Link>
  </div>
);

export default NotFound;