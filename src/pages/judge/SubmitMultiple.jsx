import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import { useToast } from "../../components/Toast.jsx";

const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
const GENDERS    = ["Boys", "Girls", "Mixed"];
const HOUSES     = ["Blue", "Yellow", "Green"];
const emptyRow   = () => ({ category: "", gender: "", gold: "", silver: "", bronze: "" });

const SubmitMultiple = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast    = useToast();

  const preFilled = location.state || {};

  const [gameName, setGameName] = useState(preFilled.gameName || "");
  const [rows,     setRows]     = useState([emptyRow()]);
  const [games,    setGames]    = useState([]);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    if (!preFilled.gameName) {
      // ✅ public route — no role needed
      api.get("api/games?limit=200").then(({ data }) => {
        const names = [...new Set((data.games || []).map((g) => g.name))];
        setGames(names);
      });
    }
  }, [preFilled.gameName]);

  const updateRow = (i, field, value) =>
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));

  const addRow    = () => setRows((p) => [...p, emptyRow()]);
  const removeRow = (i) => setRows((p) => p.filter((_, idx) => idx !== i));

 const handleSubmit = async () => {
  if (!gameName) return toast("Select a game first", "error");
  const isValid = rows.every((r) => r.category && r.gender && r.gold && r.silver && r.bronze);
  if (!isValid) return toast("Please fill all fields in all rows", "error");

  setSaving(true);
  try {
    const { data } = await api.post(
      "api/games/scores/multiple",
      { gameName, scores: rows },
      { role: "judge" }
    );
    toast(`${data.submitted?.length || 0} score(s) submitted`, "success");

    // ✅ Save all submitted rows directly to localStorage
    const stored = JSON.parse(localStorage.getItem("judgeSubmittedScores") || "{}");
    rows.forEach((row) => {
      const key    = `${gameName}|${row.category}|${row.gender}`;
      stored[key]  = { gold: row.gold, silver: row.silver, bronze: row.bronze };
    });
    localStorage.setItem("judgeSubmittedScores", JSON.stringify(stored));

    if (preFilled.gameName) {
      navigate("/judge");
    } else {
      setRows([emptyRow()]);
      setGameName("");
    }
  } catch (err) {
    toast(err.response?.data?.message || "Failed", "error");
  } finally {
    setSaving(false);
  }
};
  return (
    <Layout>
      <div className="page__header">
        <h1 className="page__title">Submit Batch Results</h1>
        <p className="page__subtitle">
          {gameName
            ? `Recording multiple categories for: ${gameName}`
            : "Submit multiple results at once"}
        </p>
      </div>

      <div className="form" style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Game Selection */}
        <div className="form__group" style={{
          background:   preFilled.gameName ? "var(--bg-secondary, #f8f9fa)" : "transparent",
          padding:      preFilled.gameName ? "15px" : "0",
          borderRadius: "8px",
          border:       preFilled.gameName ? "1px solid var(--border)" : "none",
          marginBottom: "20px",
        }}>
          <label className="form__label">Game Event</label>
          {preFilled.gameName ? (
            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }}>
              {gameName}
            </div>
          ) : (
            <select className="form__select" value={gameName} onChange={(e) => setGameName(e.target.value)}>
              <option value="">Select game…</option>
              {games.map((g) => <option key={g}>{g}</option>)}
            </select>
          )}
        </div>

        {/* Dynamic Rows */}
        {rows.map((row, i) => (
          <div key={i} style={{
            background:   "var(--bg-card, #fff)",
            border:       "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding:      20,
            marginBottom: 16,
            boxShadow:    "var(--shadow-sm)",
          }}>
            <div style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              marginBottom:   15,
            }}>
              <span style={{
                background:   "var(--primary)",
                color:        "#fff",
                padding:      "2px 10px",
                borderRadius: "20px",
                fontSize:     "0.75rem",
                fontWeight:   700,
              }}>
                ENTRY #{i + 1}
              </span>
              {rows.length > 1 && (
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => removeRow(i)}
                  style={{ color: "var(--error, #ff4d4d)" }}
                >
                  ✕ Remove
                </button>
              )}
            </div>

            <div className="form__row">
              <div className="form__group">
                <label className="form__label">Category</label>
                <select className="form__select" value={row.category} onChange={(e) => updateRow(i, "category", e.target.value)}>
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form__group">
                <label className="form__label">Gender</label>
                <select className="form__select" value={row.gender} onChange={(e) => updateRow(i, "gender", e.target.value)}>
                  <option value="">Select…</option>
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="form__row form__row--3">
              {["gold", "silver", "bronze"].map((medal) => (
                <div key={medal} className="form__group">
                  <label className="form__label" style={{ fontSize: "0.8rem" }}>
                    {medal === "gold" ? "🥇 Gold" : medal === "silver" ? "🥈 Silver" : "🥉 Bronze"}
                  </label>
                  <select className="form__select" value={row[medal]} onChange={(e) => updateRow(i, medal, e.target.value)}>
                    <option value="">House…</option>
                    {HOUSES.map((h) => <option key={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="btn-group" style={{
          marginTop:   20,
          display:     "flex",
          gap:         "10px",
          padding:     "20px",
          background:  "var(--bg-secondary, #f8f9fa)",
          borderRadius:"12px",
        }}>
          <button className="btn btn--ghost" onClick={addRow} style={{ flex: 1, background: "#fff" }}>
            + Add Another Category
          </button>
          <button className="btn btn--primary" onClick={handleSubmit} disabled={saving} style={{ flex: 2 }}>
            {saving ? "Submitting…" : `Submit ${rows.length} Result(s)`}
          </button>
        </div>

        {preFilled.gameName && (
          <button
            className="btn btn--ghost btn--full"
            style={{ marginTop: 12 }}
            onClick={() => navigate(-1)}
          >
            Cancel and Return
          </button>
        )}
      </div>
    </Layout>
  );
};

export default SubmitMultiple;