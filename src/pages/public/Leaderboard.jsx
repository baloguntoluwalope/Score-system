import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.jsx";
import MedalBadge from "../../components/MedalBadge.jsx";
import GameCard from "../../components/GameCard.jsx";
import Pagination from "../../components/Pagination.jsx";

const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
const GENDERS    = ["Boys", "Girls", "Mixed"];

const HOUSE_COLORS = {
  Blue:   "var(--house-blue)",
  Yellow: "var(--house-yellow)",
  Green:  "var(--house-green)",
};

const rankEmoji = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

// ── Medal + Points Summary Cards ──────────────────────────────────────────────
const SummaryCards = ({ medalTable, overallLeaderboard }) => {
  const pointsMap = {};
  (overallLeaderboard || []).forEach((r) => { pointsMap[r.house] = r.points ?? 0; });

  const houses = Object.entries(medalTable || {});
  if (houses.length === 0) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 10,
      marginBottom: 28,
    }}>
      {houses.map(([house, medals]) => {
        const pts = pointsMap[house] ?? 0;
        const color = HOUSE_COLORS[house] || "var(--primary)";
        return (
          <div key={house} style={{
            background: "var(--card)",
            borderRadius: "var(--radius)",
            border: `2px solid ${color}`,
            padding: "14px 10px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}>
            {/* House name */}
            <p style={{
              fontWeight: 800,
              fontSize: "clamp(0.78rem, 2.5vw, 1rem)",
              color,
              lineHeight: 1.2,
            }}>
              {house}
            </p>

            {/* Points */}
            <div style={{
              background: color,
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              padding: "4px 10px",
              fontWeight: 900,
              fontSize: "clamp(1rem, 4vw, 1.6rem)",
              lineHeight: 1,
              width: "100%",
              textAlign: "center",
            }}>
              {pts}
              <span style={{ fontSize: "0.6em", fontWeight: 500, opacity: 0.85, marginLeft: 3 }}>
                pts
              </span>
            </div>

            {/* Medals — stacked vertically, each on one line */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              width: "100%",
            }}>
              {[
                { type: "gold",   emoji: "🥇", count: medals?.gold   ?? 0 },
                { type: "silver", emoji: "🥈", count: medals?.silver ?? 0 },
                { type: "bronze", emoji: "🥉", count: medals?.bronze ?? 0 },
              ].map(({ type, emoji, count }) => (
                <div key={type} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--bg)",
                  borderRadius: "var(--radius-sm)",
                  padding: "3px 8px",
                  fontSize: "clamp(0.72rem, 2vw, 0.85rem)",
                }}>
                  <span>{emoji}</span>
                  <span style={{ fontWeight: 700, color: "var(--text)" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Leaderboard Table ─────────────────────────────────────────────────────────
const Table = ({ data }) => {
  if (!data || data.length === 0) return (
    <div style={{
      textAlign: "center", padding: "36px 20px",
      color: "var(--text-muted)", background: "var(--card)",
      borderRadius: "var(--radius)", border: "1px solid var(--border)",
    }}>
      No scores recorded yet.
    </div>
  );

  const maxPoints = Math.max(...data.map((r) => r.points ?? 0), 1);

  return (
    <div style={{
      background: "var(--card)",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      {data.map((row, i) => {
        const pts   = row.points ?? 0;
        const color = HOUSE_COLORS[row.house] || "var(--primary)";
        const pct   = (pts / maxPoints) * 100;

        return (
          <div key={row.house} style={{
            padding: "14px 16px",
            borderBottom: i < data.length - 1 ? "1px solid var(--border)" : "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>

            {/* Top row: rank + house + points */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              {/* Rank */}
              <span style={{ fontSize: "1.3rem", flexShrink: 0, width: 32 }}>
                {rankEmoji(row.rank)}
              </span>

              {/* House dot + name */}
              <div style={{
                display: "flex", alignItems: "center",
                gap: 8, flex: 1, minWidth: 0,
              }}>
                <span style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: color, flexShrink: 0,
                  display: "inline-block",
                }} />
                <span style={{
                  fontWeight: 700,
                  color,
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                }}>
                  {row.house} House
                </span>
              </div>

              {/* Points */}
              <span style={{
                fontWeight: 900,
                fontSize: "1.2rem",
                color,
                flexShrink: 0,
              }}>
                {pts}
                <span style={{
                  fontSize: "0.7rem", fontWeight: 500,
                  color: "var(--text-muted)", marginLeft: 3,
                }}>
                  pts
                </span>
              </span>
            </div>

            {/* Progress bar — full width below */}
            <div style={{
              height: 8,
              background: "var(--bg)",
              borderRadius: 4,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: color,
                borderRadius: 4,
                transition: "width 0.6s ease",
                minWidth: pts > 0 ? 4 : 0,
              }} />
            </div>

          </div>
        );
      })}
    </div>
  );
};

// ── Tab Bar ───────────────────────────────────────────────────────────────────
const TabBar = ({ tabs, tab, setTab }) => (
  <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
    padding: "8px",
    background: "var(--bg)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
  }}>
    {tabs.map((t) => (
      <button
        key={t.key}
        onClick={() => setTab(t.key)}
        style={{
          padding: "6px 12px",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          fontWeight: tab === t.key ? 700 : 500,
          fontSize: "0.82rem",
          background: tab === t.key ? "var(--primary)" : "transparent",
          color: tab === t.key ? "#fff" : "var(--text-muted)",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {t.label}
      </button>
    ))}
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const Leaderboard = () => {
  const [data,            setData]            = useState(null);
  const [tab,             setTab]             = useState("overall");
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(false);
  const [events,          setEvents]          = useState([]);
  const [eventPage,       setEventPage]       = useState(1);
  const [eventTotalPages, setEventTotalPages] = useState(1);
  const [eventTotal,      setEventTotal]      = useState(0);
  const [eventsLoading,   setEventsLoading]   = useState(true);

  // Fetch leaderboard — auto refresh every 30s
  const fetchLeaderboard = () => {
    api.get("api/games/leaderboard")
      .then(({ data: res }) => { setData(res); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch events with pagination
  const fetchEvents = (p = 1) => {
    setEventsLoading(true);
    api.get(`api/games?page=${p}&limit=6`)
      .then(({ data: res }) => {
        setEvents(res.games || []);
        setEventTotalPages(res.totalPages || 1);
        setEventTotal(res.total || 0);
      })
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false));
  };

  useEffect(() => {
    fetchEvents(eventPage);
  }, [eventPage]);

  const handleEventPageChange = (p) => {
    setEventPage(p);
    window.scrollTo({ top: document.getElementById("events-section")?.offsetTop - 80, behavior: "smooth" });
  };

  const tabs = [
    { key: "overall", label: "🏆 Overall" },
    ...CATEGORIES.map((c) => ({ key: `cat-${c}`, label: c })),
    ...GENDERS.map((g)    => ({ key: `gen-${g}`, label: g })),
  ];

  const getCurrentData = () => {
    if (!data) return [];
    if (tab === "overall")      return data.overallLeaderboard ?? [];
    if (tab.startsWith("cat-")) return data.categoryLeaderboard?.[tab.replace("cat-", "")] ?? [];
    if (tab.startsWith("gen-")) return data.genderLeaderboard?.[tab.replace("gen-", "")]   ?? [];
    return [];
  };

  return (
    <>
      {/* ── Public Navbar ──────────────────────────────────────────────────── */}
      <nav className="public-navbar">
        <Link to="/" className="public-navbar__brand">🏆 Sports Day</Link>
        <div className="public-navbar__links">
          <Link to="/">Events</Link>
          <Link to="/login">Admin / Judge</Link>
        </div>
      </nav>

      <div className="public-page">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}>
          <div>
            <h1 className="page__title">🏆 Leaderboard</h1>
            <p className="page__subtitle">Live standings — refreshes every 30s</p>
          </div>
          <button
            className="btn btn--outline btn--sm"
            onClick={fetchLeaderboard}
            disabled={loading}
          >
            {/* {loading ? "Loading…" : "↻ Refresh"} */}
          </button>
        </div>

        {/* ── Loading ─────────────────────────────────────────────────────── */}
        {loading && !data && (
          <div style={{ display: "flex", justifyContent: "center", height: 200, alignItems: "center" }}>
            <div className="spinner" />
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────────── */}
        {!loading && error && (
          <div style={{
            textAlign: "center", padding: "32px 20px",
            color: "var(--error)", fontWeight: 600,
            background: "#FFEBEE", borderRadius: "var(--radius)",
            border: "1px solid var(--error)",
          }}>
            ⚠️ Failed to load leaderboard. Check your connection.
          </div>
        )}

        {/* ── Main Content ────────────────────────────────────────────────── */}
        {!loading && !error && data && (
          <>
            {/* Medal + Points Summary */}
            <SummaryCards
              medalTable={data.medalTable}
              overallLeaderboard={data.overallLeaderboard}
            />

            {/* Points key */}
            <p style={{
              textAlign: "center",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              marginBottom: 20,
            }}>
              🥇 Gold = 5pts &nbsp;·&nbsp; 🥈 Silver = 3pts &nbsp;·&nbsp; 🥉 Bronze = 1pt
            </p>

            {/* Tabs */}
            <TabBar tabs={tabs} tab={tab} setTab={setTab} />

            {/* Tab label */}
            <p style={{
              fontSize: "0.85rem", color: "var(--text-muted)",
              fontWeight: 600, marginBottom: 12,
            }}>
              {tab === "overall"
                ? "Overall standings across all events"
                : `Standings — ${tab.replace("cat-", "").replace("gen-", "")}`}
            </p>

            {/* Table */}
            <Table data={getCurrentData()} />
          </>
        )}

        {/* ── Events Section ───────────────────────────────────────────────── */}
        <div id="events-section" style={{ marginTop: 40 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 8,
          }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)" }}>
              All Events
              {eventTotal > 0 && (
                <span style={{
                  marginLeft: 8,
                  background: "#E8EAF6",
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontWeight: 700,
                }}>
                  {eventTotal}
                </span>
              )}
            </h2>
          </div>

          {eventsLoading ? (
            <div style={{ display: "flex", justifyContent: "center", height: 160, alignItems: "center" }}>
              <div className="spinner" />
            </div>
          ) : events.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0" }}>
              No events available yet.
            </p>
          ) : (
            <>
              <div className="games-grid">
                {events.map((game) => (
                  <GameCard key={game._id} game={game} onClick={() => {}} />
                ))}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid var(--border)",
              }}>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Page {eventPage} of {eventTotalPages}
                </p>
                <Pagination
                  page={eventPage}
                  totalPages={eventTotalPages}
                  onPageChange={handleEventPageChange}
                />
              </div>
            </>
          )}
        </div>

      </div>
    </>
  );
};

export default Leaderboard;
