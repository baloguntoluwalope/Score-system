import { useState, useEffect } from "react";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import { useToast } from "../../components/Toast.jsx";

const PublishGames = () => {
  const [groups,  setGroups]  = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchGames = () => {
    api.get("/games?limit=200")
      .then(({ data }) => {
        const grouped = (data.games || []).reduce((acc, g) => {
          if (!acc[g.gameId]) {
            acc[g.gameId] = {
              gameId: g.gameId, name: g.name,
              published: g.published, publicLink: g.publicLink,
              variants: [],
            };
          }
          acc[g.gameId].variants.push(`${g.category} · ${g.gender}`);
          return acc;
        }, {});
        setGroups(Object.values(grouped));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGames(); }, []);

const handleToggle = async (gameId, isPublished) => {
    try {
      if (isPublished) {
        await api.post(`/games/unpublish/${gameId}`, {}, { role: "admin" }); // ✅
        toast("Unpublished", "warning");
      } else {
        const { data } = await api.post(`/games/publish/${gameId}`, {}, { role: "admin" }); // ✅
        toast(`Published! Link: ${data.publicLink}`, "success");
      }
      fetchGames();
    } catch { toast("Action failed", "error"); }
  };
  return (
    <Layout>
      <div className="page__header">
        <h1 className="page__title">Publish Games</h1>
        <p className="page__subtitle">Control what the audience can see</p>
      </div>

      {loading ? (
        <div className="loading-screen" style={{ height: 300 }}>
          <div className="spinner" />
        </div>
      ) : groups.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: 60 }}>
          No games found. Create games first.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {groups.map((g) => (
            <div key={g.gameId} className="form" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "16px 20px",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, marginBottom: 6 }}>{g.name}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {g.variants.map((v) => (
                    <span key={v} className="game-card__tag">{v}</span>
                  ))}
                </div>
                {g.published && g.publicLink && (
                  <p style={{
                    fontSize: "0.78rem", color: "var(--success)",
                    marginTop: 6, wordBreak: "break-all",
                  }}>
                    🔗 /public/{g.publicLink}
                  </p>
                )}
              </div>
              <button
                className={`btn btn--sm ${g.published ? "btn--outline" : "btn--success"}`}
                onClick={() => handleToggle(g.gameId, g.published)}
                style={{ flexShrink: 0 }}
              >
                {g.published ? "Unpublish" : "Publish"}
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default PublishGames;