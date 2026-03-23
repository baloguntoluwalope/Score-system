import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";

const houseColors = {
  Blue: "#2196F3",
  Yellow: "#FFEB3B",
  Green: "#4CAF50",
};

const GameDetail = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGame = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`api/games/${gameId}`);
      setGame(data);
    } catch (error) {
      console.error(error);
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!game) return <p style={{ textAlign: "center", marginTop: 60 }}>Game not found.</p>;

  const maxPoints = Math.max(...game.houseScores.map(h => h.points || 0), 1);

  return (
    <div style={{ padding: "16px", maxWidth: "900px", margin: "auto" }}>
      {/* Game Header */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>{game.name}</h1>
        <p style={{ fontSize: "1rem", color: "#666" }}>{game.category} - {game.gender}</p>
        {game.published && <span style={{ background: "#E8F5E9", color: "#2E7D32", padding: "4px 12px", borderRadius: "12px" }}>Live</span>}
      </div>

      {/* Houses Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "16px"
      }}>
        {game.houseScores.map(hs => (
          <div key={hs.house} style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            transition: "transform 0.2s",
            cursor: "pointer"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <h2 style={{ color: houseColors[hs.house] || "#333", fontWeight: 700 }}>{hs.house}</h2>

            <div style={{ width: "100%", background: "#f1f1f1", borderRadius: "8px", height: "16px", overflow: "hidden" }}>
              <div style={{
                width: `${(hs.points / maxPoints) * 100}%`,
                height: "100%",
                background: houseColors[hs.house] || "#2196F3",
                transition: "width 0.5s ease"
              }} />
            </div>

            <span style={{ fontWeight: 600, fontSize: "1rem" }}>{hs.points} pts</span>

            {hs.medals && hs.medals.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {hs.medals.map((m, idx) => (
                  <span key={idx} style={{
                    background: m === "gold" ? "#FFD700" : m === "silver" ? "#C0C0C0" : "#CD7F32",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: 600
                  }}>{m}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button className="btn btn--primary" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default GameDetail;