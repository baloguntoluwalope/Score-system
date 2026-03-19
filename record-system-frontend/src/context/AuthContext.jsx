import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [judgeUser, setJudgeUser] = useState(null);
  const [loading,   setLoading]   = useState(true);

  // Restore both sessions on reload
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");
    const storedJudge = localStorage.getItem("judgeUser");
    const adminToken  = localStorage.getItem("adminToken");
    const judgeToken  = localStorage.getItem("judgeToken");

    if (storedAdmin && adminToken) setAdminUser(JSON.parse(storedAdmin));
    if (storedJudge && judgeToken) setJudgeUser(JSON.parse(storedJudge));

    setLoading(false);
  }, []);

  const loginAdmin = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/admin/login", { email, password });
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser",  JSON.stringify(data.user));
    setAdminUser(data.user);
    return data.user;
  }, []);

  const loginJudge = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/judge/login", { email, password });
    localStorage.setItem("judgeToken", data.token);
    localStorage.setItem("judgeUser",  JSON.stringify(data.user));
    setJudgeUser(data.user);
    return data.user;
  }, []);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
  }, []);

 const logoutJudge = useCallback(() => {
  localStorage.removeItem("judgeToken");
  localStorage.removeItem("judgeUser");
  localStorage.removeItem("judgeSubmittedScores"); // ✅ clear on logout
  setJudgeUser(null);
}, []);

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("judgeToken");
    localStorage.removeItem("judgeUser");
    setAdminUser(null);
    setJudgeUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      adminUser,
      judgeUser,
      loading,
      isAdmin:        !!adminUser,
      isJudge:        !!judgeUser,
      isLoggedIn:     !!adminUser || !!judgeUser,
      isBothLoggedIn: !!adminUser && !!judgeUser,
      loginAdmin,
      loginJudge,
      logoutAdmin,
      logoutJudge,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import api from "../api/axios.jsx";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user,    setUser]    = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Restore session on reload
//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     const token  = localStorage.getItem("token");
//     if (stored && token) setUser(JSON.parse(stored));
//     setLoading(false);
//   }, []);

//  // In your AuthContext, store tokens separately so both can coexist
// const loginAdmin = async (email, password) => {
//   const { data } = await api.post("/admin/login", { email, password });
//   localStorage.setItem("adminToken", data.token);  // separate key
//   setAdmin(data.user);
//   return data.user;
// };

// // login
// const loginJudge = async (email, password) => {
//   const { data } = await api.post("/judge/login", { email, password });
//   localStorage.setItem("judgeToken", data.token);  // separate key
//   setJudge(data.user);
//   return data.user;
// };
//   const logout = useCallback(() => {
//     localStorage.clear();
//     setUser(null);
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       isAdmin:    user?.role === "admin",
//       isJudge:    user?.role === "judge",
//       isLoggedIn: !!user,
//       loginAdmin,
//       loginJudge,
//       logout,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be inside AuthProvider");
//   return ctx;
// };






// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import api from "../../api/axios.jsx";
// import MedalBadge from "../../components/MedalBadge.jsx";

// const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
// const GENDERS    = ["Boys", "Girls", "Mixed"];

// const houseColors = {
//   Blue:   "var(--house-blue)",
//   Yellow: "var(--house-yellow)",
//   Green:  "var(--house-green)",
//   Red:    "var(--house-red)",
// };

// const rankEmoji = (rank) => {
//   if (rank === 1) return "🥇";
//   if (rank === 2) return "🥈";
//   if (rank === 3) return "🥉";
//   return `#${rank}`;
// };

// // ── Leaderboard Table ─────────────────────────────────────────────────────────
// const Table = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div style={{
//         textAlign: "center", padding: "40px 20px",
//         color: "var(--text-muted)", background: "var(--card)",
//         borderRadius: "var(--radius)", border: "1px solid var(--border)",
//       }}>
//         No scores recorded yet for this category.
//       </div>
//     );
//   }

//   const maxPoints = Math.max(...data.map((r) => r.points), 1);

//   return (
//     <div className="leaderboard">
//       <table className="leaderboard__table">
//         <thead>
//           <tr>
//             <th style={{ width: 60 }}>Rank</th>
//             <th>House</th>
//             <th>Total Points</th>
//             <th style={{ width: "40%" }}>Progress</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row) => (
//             <tr key={row.house}>
//               {/* Rank */}
//               <td>
//                 <span style={{ fontSize: "1.2rem" }}>{rankEmoji(row.rank)}</span>
//               </td>

//               {/* House name with color dot */}
//               <td>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <span style={{
//                     width: 12, height: 12, borderRadius: "50%",
//                     background: houseColors[row.house] || "var(--primary)",
//                     display: "inline-block", flexShrink: 0,
//                   }} />
//                   <span className="leaderboard__house"
//                     style={{ color: houseColors[row.house] || "var(--text)" }}>
//                     {row.house}
//                   </span>
//                 </div>
//               </td>

//               {/* Total points — big and bold */}
//               <td>
//                 <span style={{
//                   fontSize: "1.3rem", fontWeight: 800,
//                   color: houseColors[row.house] || "var(--primary)",
//                 }}>
//                   {row.points}
//                   <span style={{ fontSize: "0.75rem", fontWeight: 500,
//                     color: "var(--text-muted)", marginLeft: 4 }}>
//                     pts
//                   </span>
//                 </span>
//               </td>

//               {/* Progress bar */}
//               <td>
//                 <div style={{
//                   background: "var(--bg)", borderRadius: 6,
//                   height: 10, overflow: "hidden", width: "100%",
//                 }}>
//                   <div style={{
//                     height: "100%",
//                     width: `${(row.points / maxPoints) * 100}%`,
//                     background: houseColors[row.house] || "var(--primary)",
//                     borderRadius: 6,
//                     transition: "width 0.5s ease",
//                   }} />
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // ── Medal + Points Summary Cards ──────────────────────────────────────────────
// const SummaryCards = ({ medalTable, overallLeaderboard }) => {
//   // Merge points into medal table
//   const pointsMap = {};
//   (overallLeaderboard || []).forEach((r) => { pointsMap[r.house] = r.points; });

//   return (
//     <div style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
//       gap: 14,
//       marginBottom: 32,
//     }}>
//       {Object.entries(medalTable).map(([house, medals]) => (
//         <div key={house} style={{
//           background: "var(--card)",
//           borderRadius: "var(--radius)",
//           border: `2px solid ${houseColors[house] || "var(--border)"}`,
//           padding: "18px 16px",
//           textAlign: "center",
//         }}>
//           {/* House name */}
//           <p style={{
//             fontWeight: 800, fontSize: "1rem", marginBottom: 4,
//             color: houseColors[house] || "var(--text)",
//           }}>
//             {house} House
//           </p>

//           {/* Total points */}
//           <p style={{
//             fontSize: "2rem", fontWeight: 900, lineHeight: 1,
//             color: houseColors[house] || "var(--primary)",
//             marginBottom: 12,
//           }}>
//             {pointsMap[house] ?? 0}
//             <span style={{ fontSize: "0.8rem", fontWeight: 500,
//               color: "var(--text-muted)", marginLeft: 4 }}>
//               pts
//             </span>
//           </p>

//           {/* Medals */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//             <MedalBadge type="gold"   count={medals.gold} />
//             <MedalBadge type="silver" count={medals.silver} />
//             <MedalBadge type="bronze" count={medals.bronze} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ── Main Leaderboard Page ─────────────────────────────────────────────────────
// const Leaderboard = () => {
//   const [data,    setData]    = useState(null);
//   const [tab,     setTab]     = useState("overall");
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState(false);

//   useEffect(() => {
//     api.get("/games/leaderboard")
//       .then(({ data }) => setData(data))
//       .catch(() => setError(true))
//       .finally(() => setLoading(false));
//   }, []);

//   const tabs = [
//     { key: "overall", label: "Overall" },
//     ...CATEGORIES.map((c) => ({ key: `cat-${c}`, label: c })),
//     ...GENDERS.map((g)    => ({ key: `gen-${g}`, label: g })),
//   ];

//   const getCurrentData = () => {
//     if (!data) return [];
//     if (tab === "overall")        return data.overallLeaderboard || [];
//     if (tab.startsWith("cat-"))   return data.categoryLeaderboard?.[tab.replace("cat-", "")] || [];
//     if (tab.startsWith("gen-"))   return data.genderLeaderboard?.[tab.replace("gen-", "")] || [];
//     return [];
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <nav className="public-navbar">
//         <Link to="/" className="public-navbar__brand">🏆 Sports Day</Link>
//         <div className="public-navbar__links">
//           <Link to="/">Events</Link>
//           <Link to="/login">Admin / Judge</Link>
//         </div>
//       </nav>

//       <div className="public-page">
//         {/* Header */}
//         <div className="page__header">
//           <h1 className="page__title">🏆 Leaderboard</h1>
//           <p className="page__subtitle">Live standings across all events</p>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="loading-screen" style={{ height: 300 }}>
//             <div className="spinner" />
//           </div>
//         )}

//         {/* Error */}
//         {!loading && error && (
//           <div style={{
//             textAlign: "center", padding: 40,
//             color: "var(--error)", fontWeight: 600,
//           }}>
//             Failed to load leaderboard. Check your connection.
//           </div>
//         )}

//         {/* Content */}
//         {!loading && !error && data && (
//           <>
//             {/* Summary cards — points + medals per house */}
//             {data.medalTable && (
//               <SummaryCards
//                 medalTable={data.medalTable}
//                 overallLeaderboard={data.overallLeaderboard}
//               />
//             )}

//             {/* Tab switcher */}
//             <div className="leaderboard-tabs" style={{ flexWrap: "wrap", marginBottom: 20 }}>
//               {tabs.map((t) => (
//                 <button
//                   key={t.key}
//                   className={`leaderboard-tab${tab === t.key ? " active" : ""}`}
//                   onClick={() => setTab(t.key)}
//                 >
//                   {t.label}
//                 </button>
//               ))}
//             </div>

//             {/* Tab label */}
//             <p style={{
//               fontSize: "0.85rem", color: "var(--text-muted)",
//               marginBottom: 12, fontWeight: 600,
//             }}>
//               {tab === "overall"
//                 ? "Overall standings across all events"
//                 : `Standings for ${tab.replace("cat-", "").replace("gen-", "")}`}
//             </p>

//             {/* Table */}
//             <Table data={getCurrentData()} />
//           </>
//         )}

//         {/* Empty state — no scores yet */}
//         {!loading && !error && !data && (
//           <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
//             <div style={{ fontSize: "3rem", marginBottom: 12 }}>🏁</div>
//             <p>No scores recorded yet. Check back soon.</p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Leaderboard;