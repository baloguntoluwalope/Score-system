import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import GameCard from "../../components/GameCard.jsx";
import Pagination from "../../components/Pagination.jsx";


const ITEMS_PER_PAGE = 6;
const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
const GENDERS = ["Boys", "Girls", "Mixed"];

const AdminDashboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [allGames, setAllGames] = useState([]);
  
  const navigate = useNavigate();

  // ── Core Fetch Function ──────────────────────────────────────────
  const fetchGames = async (p = 1, isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    const params = new URLSearchParams({ page: p, limit: ITEMS_PER_PAGE });
    if (category) params.append("category", category);
    if (gender) params.append("gender", gender);

    try {
      const { data } = await api.get(`api/games?${params}`);
      setGames(data.games || []);
      setTotal(data.totalGames || 0);
      setTotalPages(data.totalPages || 1);
      
      // Fetch full stats for the top cards
      const statsRes = await api.get("api/games?limit=1000");
      setAllGames(statsRes.data.games || []);
      
      if (isManualRefresh) toast.success("Dashboard Synchronized");
    } catch (err) {
      toast.error("Failed to sync data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGames(page);
  }, [category, gender, page]);

  // Reset to page 1 if filters change
  useEffect(() => { setPage(1); }, [category, gender]);

  const handlePublish = async (gameId) => {
    if (!window.confirm("Are you sure you want to make these results LIVE on the leaderboard?")) return;
    
    try {
      await api.patch(`/games/${gameId}/publish`);
      toast.success("Results are now LIVE!");
      fetchGames(page); // Refresh list to update status
    } catch (err) {
      toast.error(err.response?.data?.message || "Publishing failed");
    }
  };

  // ── Stats Calculations ─────────────────────────────────────────────
  const publishedCount = allGames.filter((g) => g.published).length;
  const pendingCount = allGames.length - publishedCount;

  const statCards = [
    { label: "Total Events", value: allGames.length, icon: "🏁", bg: "#f0f4ff" },
    { label: "Live", value: publishedCount, icon: "✅", bg: "#e6fffa" },
    { label: "Pending", value: pendingCount, icon: "⏳", bg: "#fffaf0" },
  ];

  return (
    <Layout>
      <div className="page__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page__title">Admin Overview</h1>
          <p className="page__subtitle">Monitor submissions and control leaderboard visibility</p>
        </div>
        <button 
          className={`btn ${refreshing ? 'btn--disabled' : 'btn--ghost'}`} 
          onClick={() => fetchGames(page, true)}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {refreshing ? "Syncing..." : "🔄 Refresh Data"}
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {statCards.map((s) => (
          <div key={s.label} className="card" style={{ padding: '20px', background: s.bg, border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
               <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{s.value}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="card" style={{ padding: '15px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>Filter By:</span>
        <select className="form__select" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 'auto', minWidth: '150px', marginBottom: 0 }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="form__select" value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: 'auto', minWidth: '150px', marginBottom: 0 }}>
          <option value="">All Genders</option>
          {GENDERS.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      {/* ── Events Grid ── */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}><div className="spinner" /></div>
      ) : (
        <>
          <div className="games-grid">
            {games.map((game) => {
              // Calculate unique judges across all house score entries
              const uniqueJudges = new Set(game.houseScores.flatMap(hs => hs.judges || [])).size;
              const needsReview = !game.published && uniqueJudges > 0;

              return (
                <div key={game._id} style={{ position: "relative" }}>
                  
                  {/* Status Indicator */}
                  <div style={{ 
                    position: "absolute", top: 12, left: 12, zIndex: 5, 
                    fontSize: "0.6rem", padding: "3px 10px", borderRadius: "20px", 
                    background: game.published ? "#dcfce7" : "#fffbeb", 
                    color: game.published ? "#166534" : "#92400e",
                    fontWeight: 'bold', border: '1px solid currentColor'
                  }}>
                    {game.published ? "● LIVE" : "○ PENDING"}
                  </div>

                  {/* Publish Button - High Z-Index to stay clickable */}
                  {needsReview && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePublish(game.gameId); }}
                      style={{ 
                        position: "absolute", top: 12, right: 12, zIndex: 10, 
                        background: 'var(--success)', color: 'white', border: 'none', 
                        padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', 
                        fontWeight: 'bold', fontSize: '0.7rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      PUBLISH NOW
                    </button>
                  )}

                  {/* Game Card - Logic removed to prevent Detail Page navigation */}
                  <div style={{ cursor: 'default' }}>
                    <GameCard 
                      game={game} 
                      style={{ 
                        boxShadow: needsReview ? '0 0 0 2px var(--success)' : 'var(--shadow-sm)',
                        transition: 'none',
                        pointerEvents: 'none' // Disables clicks/hover on the card itself
                      }} 
                    />
                  </div>
                  
                  {/* Footer Label */}
                  <p style={{ fontSize: '0.75rem', marginTop: '12px', textAlign: 'center', color: '#444', fontWeight: '500' }}>
                    {uniqueJudges > 0 ? (
                       <span>📊 <strong>{uniqueJudges}</strong> {uniqueJudges === 1 ? 'Judge' : 'Judges'} recorded results</span>
                    ) : (
                       <span style={{ color: '#999' }}>No submissions yet</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Pagination Controls ── */}
        {/* ── Consolidated Pagination ── */}
{/* ── Single, Unified Pagination ── */}
<div style={{ 
  marginTop: '50px', 
  borderTop: '1px solid var(--border)', 
  paddingTop: '30px', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px' 
}}>
  {/* Left: Metadata */}
  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
    Showing <strong>{((page - 1) * ITEMS_PER_PAGE) + 1}</strong> - <strong>{Math.min(page * ITEMS_PER_PAGE, total)}</strong> of <strong>{total}</strong> events
  </div>

  {/* Right: The Component (Which likely already has Prev/Next inside it) */}
  <div className="admin-pagination-wrapper">
    <Pagination 
      page={page} 
      totalPages={totalPages} 
      onPageChange={(p) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} 
    />
  </div>
</div>
        </>
      )}
    </Layout>
  );
};

export default AdminDashboard;

