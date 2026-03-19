import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import GameCard from "../../components/GameCard.jsx";
import Pagination from "../../components/Pagination.jsx";

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
const GENDERS = ["Boys", "Girls", "Mixed"];

const JudgeDashboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchGames = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: ITEMS_PER_PAGE });
    if (category) params.append("category", category);
    if (gender) params.append("gender", gender);
    if (search) params.append("search", search.trim());

    api.get(`/games?${params}`)
      .then(({ data }) => {
        setGames(data.games || []);
        setTotal(data.totalGames || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  // Trigger fetch on filter or page change
  useEffect(() => {
    fetchGames(page);
  }, [category, gender, search, page]);

  // Reset to page 1 when filters are adjusted
  useEffect(() => {
    setPage(1);
  }, [category, gender, search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setCategory("");
    setGender("");
    setSearch("");
    setPage(1);
  };

  return (
    <Layout>
      <div className="page__header">
        <h1 className="page__title">Field Judge Portal</h1>
        <p className="page__subtitle">Record and track inter-house event results</p>
      </div>

      {/* --- Quick Submission Actions --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 32 }}>
        <button className="btn btn--primary" onClick={() => navigate("/judge/submit")} style={{ padding: '20px' }}>
          <span style={{ fontSize: '1.5rem', display: 'block' }}>🥇</span> Submit Single Event
        </button>
        <button className="btn btn--accent" onClick={() => navigate("/judge/submit/batch")} style={{ padding: '20px' }}>
          <span style={{ fontSize: '1.5rem', display: 'block' }}>📋</span> Batch Upload
        </button>
      </div>

      {/* --- Filter Section --- */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search game name..." 
            className="form__input" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 2, minWidth: '200px', marginBottom: 0 }}
          />
          <select className="form__select" value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="form__select" value={gender} onChange={(e) => setGender(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
            <option value="">All Genders</option>
            {GENDERS.map(g => <option key={g}>{g}</option>)}
          </select>
          {(category || gender || search) && (
            <button className="btn btn--ghost" onClick={clearFilters}>Reset</button>
          )}
        </div>
      </div>

      {/* --- Events Grid --- */}
      {loading ? (
        <div className="flex-center" style={{ height: '300px' }}><div className="spinner" /></div>
      ) : (
        <>
          <div className="games-grid">
            {games.map((game) => {
              // FIX: Correctly count UNIQUE judges to avoid "3 or 6" display error
              const allJudgeIds = game.houseScores.flatMap(hs => hs.judges || []);
              const uniqueJudgeCount = new Set(allJudgeIds).size;
              
              return (
                <div key={game._id} style={{ position: "relative" }}>
                  
                  {/* Submission Tally Indicator */}
                  <div style={{
                    position: "absolute", top: -10, left: 10, zIndex: 5,
                    background: uniqueJudgeCount > 0 ? "var(--primary)" : "#666",
                    color: "#fff", fontSize: "0.7rem", fontWeight: 800,
                    padding: "4px 12px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                  }}>
                    {uniqueJudgeCount === 0 ? "NO SUBMISSIONS" : `${uniqueJudgeCount} JUDGE(S) RECORDED`}
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    position: "absolute", top: 12, right: 12, zIndex: 5,
                    background: game.published ? "var(--success)" : "#FF9800",
                    color: "#fff", fontSize: "0.65rem", fontWeight: 900,
                    padding: "2px 8px", borderRadius: "4px", textTransform: 'uppercase'
                  }}>
                    {game.published ? "Verified & Live" : "Pending Admin"}
                  </div>

                  <GameCard
                    game={game}
                    onClick={() => navigate("/judge/submit", {
                      state: { gameName: game.name, category: game.category, gender: game.gender }
                    })}
                    style={{
                       border: uniqueJudgeCount > 0 ? '1.5px solid var(--primary-light)' : '1px solid var(--border)'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* --- Navigation Controls --- */}
          <div style={{ 
            marginTop: '40px', 
            padding: '30px 0',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            
            {/* Primary Prev/Next Buttons for easy thumb access on mobile */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn--secondary" 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={{ padding: '10px 25px', minWidth: '120px' }}
              >
                ← Previous
              </button>
              <button 
                className="btn btn--secondary" 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                style={{ padding: '10px 25px', minWidth: '120px' }}
              >
                Next →
              </button>
            </div>

            {/* Pagination Component & Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                Showing **{((page - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(page * ITEMS_PER_PAGE, total)}** of **{total}** events
              </p>
              <Pagination 
                page={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default JudgeDashboard;
