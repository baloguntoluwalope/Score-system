import { useState, useEffect } from "react";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import { useToast } from "../../components/Toast.jsx";

const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
const GENDERS    = ["Boys", "Girls", "Mixed"];
const HOUSES     = ["Blue", "Yellow", "Green"];

const SubmitByGame = () => {
  const [games,  setGames]  = useState([]);
  const [gameId, setGameId] = useState("");
  const [form,   setForm]   = useState({
    category: "", gender: "", gold: "", silver: "", bronze: "",
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // ✅ public route — no role needed
    api.get("api/games?limit=200").then(({ data }) => {
      const seen = {};
      (data.games || []).forEach((g) => { if (!seen[g.gameId]) seen[g.gameId] = g; });
      setGames(Object.values(seen));
    });
  }, []);

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

 const handleSubmit = async () => {
  if (!gameId || !form.category || !form.gender || !form.gold || !form.silver || !form.bronze) {
    return toast("All fields are required", "error");
  }
  if (new Set([form.gold, form.silver, form.bronze]).size !== 3) {
    return toast("A different house must be selected for each medal", "error");
  }

  setSaving(true);
  try {
    await api.post(`api/games/${gameId}/result`, { ...form }, { role: "judge" });
    toast("Score submitted!", "success");

    // ✅ Save directly to localStorage
    const selectedGame = games.find((g) => g.gameId === gameId);
    if (selectedGame) {
      const key    = `${selectedGame.name}|${form.category}|${form.gender}`;
      const stored = JSON.parse(localStorage.getItem("judgeSubmittedScores") || "{}");
      stored[key]  = { gold: form.gold, silver: form.silver, bronze: form.bronze };
      localStorage.setItem("judgeSubmittedScores", JSON.stringify(stored));
    }

    setForm({ category: "", gender: "", gold: "", silver: "", bronze: "" });
  } catch (err) {
    toast(err.response?.data?.message || "Failed", "error");
  } finally {
    setSaving(false);
  }
};

  return (
    <Layout>
      <div className="page__header">
        <h1 className="page__title">Submit by Game</h1>
        <p className="page__subtitle">Target a specific game directly</p>
      </div>

      <div className="form" style={{ maxWidth: 520 }}>
        <div className="form__group">
          <label className="form__label">Select Game</label>
          <select className="form__select" value={gameId} onChange={(e) => setGameId(e.target.value)}>
            <option value="">Choose a game...</option>
            {games.map((g) => (
              <option key={g.gameId} value={g.gameId}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="form__row">
          <div className="form__group">
            <label className="form__label">Category</label>
            <select className="form__select" value={form.category} onChange={set("category")}>
              <option value="">Select...</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form__group">
            <label className="form__label">Gender</label>
            <select className="form__select" value={form.gender} onChange={set("gender")}>
              <option value="">Select...</option>
              {GENDERS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="form__row form__row--3">
          {["gold", "silver", "bronze"].map((medal) => (
            <div key={medal} className="form__group">
              <label className="form__label" style={{ textTransform: "capitalize" }}>
                {medal === "gold" ? "🥇" : medal === "silver" ? "🥈" : "🥉"} {medal}
              </label>
              <select className="form__select" value={form[medal]} onChange={set(medal)}>
                <option value="">House...</option>
                {HOUSES.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
          ))}
        </div>

        <button
          className="btn btn--primary btn--full"
          onClick={handleSubmit}
          disabled={saving}
          style={{ padding: "13px", marginTop: 8 }}
        >
          {saving ? "Submitting..." : "Submit Score"}
        </button>
      </div>
    </Layout>
  );
};

export default SubmitByGame;