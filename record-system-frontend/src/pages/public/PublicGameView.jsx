import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios.jsx";
import HouseScoreCard from "../../components/HouseScoreCard.jsx";

const PublicGameView = () => {
  const { token } = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = () => {
      api.get(`/games/public/${token}`)
        .then(({ data }) => setData(data))
        .catch(() => {});
    };
    fetch();
    const interval = setInterval(fetch, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => { setLoading(false); }, [data]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--primary)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: "3rem" }}>🏆</div>
          <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800 }}>
            {data?.gameName || "Loading…"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 6, fontSize: "0.9rem" }}>
            Live scores • Auto-refreshes every 10s
          </p>
        </div>

        {data?.games.map((g) => (
          <div key={`${g.category}-${g.gender}`} style={{ marginBottom: 32 }}>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16, fontWeight: 600 }}>
              {g.category} — {g.gender}
            </p>
            <div className="house-grid">
              {g.houseScores.map((hs) => (
                <HouseScoreCard key={hs.house} {...hs} />
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
            ← Back to all events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicGameView;