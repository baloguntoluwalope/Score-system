import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import HouseScoreCard from "../../components/HouseScoreCard.jsx";

const AdminGameDetail = () => {
  const { gameId } = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`api/games/id/${gameId}`)
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [gameId]);

  return (
    <Layout>
      {loading ? (
        <div className="loading-screen" style={{ height: 300 }}><div className="spinner" /></div>
      ) : !data ? (
        <p>Game not found.</p>
      ) : (
        <>
          <div className="page__header">
            <Link to="/admin/games" style={{ fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "none" }}>
              ← Back to Games
            </Link>
            <h1 className="page__title" style={{ marginTop: 8 }}>{data.gameName}</h1>
            <p className="page__subtitle">{data.total} variant(s)</p>
          </div>

          {data.games.map((g) => (
            <div key={`${g.category}-${g.gender}`} style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 14, color: "var(--primary-light)" }}>
                {g.category} — {g.gender}
              </h3>
              <div className="house-grid">
                {g.houseScores.map((hs) => (
                  <HouseScoreCard key={hs.house} {...hs} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </Layout>
  );
};

export default AdminGameDetail;