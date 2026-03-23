const houseColors = {
  Blue: "#2196F3",
  Yellow: "#FFEB3B",
  Green: "#4CAF50",
  Red: "#F44336",
};

const GameCard = ({ game, onClick }) => {
  if (!game) return null;

  const scores = game.houseScores || [];
  const maxPoints = scores.length ? Math.max(...scores.map(h => h.points || 0), 1) : 1;
  const leaderPoints = Math.max(...scores.map(h => h.points || 0), 0);

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        padding: "16px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        width: "100%",
        maxWidth: "400px",
        margin: "auto",
      }}
      className="game-card"
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
      }}
    >
      <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}>
        {game.name}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
        <span style={{ background: "#E3F2FD", padding: "2px 8px", borderRadius: "8px" }}>{game.category}</span>
        <span style={{ background: "#FFF3E0", padding: "2px 8px", borderRadius: "8px" }}>{game.gender}</span>
        {game.published && <span style={{ background: "#E8F5E9", color: "#2E7D32", padding: "2px 8px", borderRadius: "8px" }}>Live</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {scores.map(hs => {
          const width = (hs.points / maxPoints) * 100;
          const isLeader = hs.points === leaderPoints;
          return (
            <div key={hs.house} style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ flex: "0 0 70px", fontWeight: isLeader ? 700 : 500, color: houseColors[hs.house] || "#333" }}>
                {hs.house}
              </span>
              <div style={{ flex: 1, minWidth: "80px", background: "#F1F1F1", borderRadius: "6px", height: "12px", overflow: "hidden" }}>
                <div style={{ width: `${width}%`, height: "100%", background: houseColors[hs.house] || "#2196F3", transition: "width 0.5s ease" }} />
              </div>
              <span style={{ width: "40px", textAlign: "right", fontWeight: 600 }}>{hs.points}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameCard;


// const houseColors = {
//   Blue: "var(--house-blue)",
//   Yellow: "var(--house-yellow)",
//   Green: "var(--house-green)",
//   // Red: "var(--house-red)",
// };

// const GameCard = ({ game, onClick }) => {
//   if (!game) return null;

//   const scores = game.houseScores || [];

//   const maxPoints = scores.length
//     ? Math.max(...scores.map((h) => h.points || 0), 1)
//     : 1;

//   const leaderPoints = Math.max(...scores.map((h) => h.points || 0), 0);

//   return (
//     <div
//       className="game-card"
//       onClick={onClick}
//       style={{ cursor: "pointer" }}
//     >
//       {/* Game Name */}
//       <div className="game-card__name">{game.name}</div>

//       {/* Game Meta */}
//       <div className="game-card__meta">
//         <span className="game-card__tag">{game.category}</span>
//         <span className="game-card__tag">{game.gender}</span>

//         {game.published && (
//           <span
//             className="game-card__tag"
//             style={{
//               background: "#E8F5E9",
//               color: "var(--success)",
//             }}
//           >
//             Live
//           </span>
//         )}
//       </div>

//       {/* Scores */}
//       <div className="game-card__scores">
//         {scores.map((hs) => {
//           const width = (hs.points / maxPoints) * 100;
//           const isLeader = hs.points === leaderPoints;

//           return (
//             <div key={hs.house} className="game-card__house-row">
//               {/* House Name */}
//               <span
//                 className="game-card__house-name"
//                 style={{
//                   color:
//                     houseColors[hs.house] || "var(--text)",
//                   fontWeight: isLeader ? "600" : "400",
//                 }}
//               >
//                 {hs.house}
//               </span>

//               {/* Score Bar */}
//               <div className="game-card__bar-wrap">
//                 <div
//                   className="game-card__bar"
//                   style={{
//                     width: `${width}%`,
//                     background:
//                       houseColors[hs.house] ||
//                       "var(--primary)",
//                     opacity: isLeader ? 1 : 0.7,
//                   }}
//                 />
//               </div>

//               {/* Points */}
//               <span className="game-card__points">
//                 {hs.points}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default GameCard;