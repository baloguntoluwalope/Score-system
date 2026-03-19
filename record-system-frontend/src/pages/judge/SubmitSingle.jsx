import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import { useToast } from "../../components/Toast.jsx";

const HOUSES     = ["Blue", "Yellow", "Green"];
const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
const GENDERS    = ["Boys", "Girls", "Mixed"];

const SubmitSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast    = useToast();

  const eventData    = location.state || {};
  const isAutoFilled = !!eventData.gameName;

  const [form, setForm] = useState({
    gameName: eventData.gameName || "",
    category: eventData.category || "",
    gender:   eventData.gender   || "",
    gold:     "",
    silver:   "",
    bronze:   "",
  });

  const [gamesList, setGamesList] = useState([]);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (!isAutoFilled) {
      // ✅ public route — no role needed
      api.get("/games?limit=200").then(({ data }) => {
        const names = [...new Set((data.games || []).map((g) => g.name))];
        setGamesList(names);
      });
    }
  }, [isAutoFilled]);

  const handleChange = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.gameName || !form.gold || !form.silver || !form.bronze) {
    return toast("Please complete all fields", "error");
  }
  if (new Set([form.gold, form.silver, form.bronze]).size !== 3) {
    return toast("A different house must be selected for each medal", "error");
  }

  setSaving(true);
  try {
    await api.post("/games/scores/single", form, { role: "judge" });
    toast("Results submitted!", "success");

    // ✅ Save directly to localStorage so dashboard reads it immediately
    const key     = `${form.gameName}|${form.category}|${form.gender}`;
    const stored  = JSON.parse(localStorage.getItem("judgeSubmittedScores") || "{}");
    stored[key]   = { gold: form.gold, silver: form.silver, bronze: form.bronze };
    localStorage.setItem("judgeSubmittedScores", JSON.stringify(stored));

    if (isAutoFilled) {
      navigate("/judge", {
        state: {
          submittedScore: {
            gameName: form.gameName,
            category: form.category,
            gender:   form.gender,
            gold:     form.gold,
            silver:   form.silver,
            bronze:   form.bronze,
          },
        },
      });
    } else {
      setForm((p) => ({ ...p, gold: "", silver: "", bronze: "" }));
    }
  } catch (err) {
    toast(err.response?.data?.message || "Error saving score", "error");
  } finally {
    setSaving(false);
  }
};

  return (
    <Layout>
      <div className="page__header">
        <h1 className="page__title">Submit Results</h1>
        <p className="page__subtitle">
          {isAutoFilled ? "Confirming winners for this event" : "Select an event and assign medals"}
        </p>
      </div>

      <div className="form" style={{ maxWidth: 500, margin: "0 auto" }}>

        {isAutoFilled ? (
          <div style={{
            background:    "var(--bg-secondary, #f8f9fa)",
            padding:       "20px",
            borderRadius:  "12px",
            marginBottom:  "30px",
            border:        "2px solid var(--primary-light, #e3f2fd)",
          }}>
            <label style={{
              fontSize:      "0.7rem",
              fontWeight:    800,
              color:         "var(--text-muted)",
              textTransform: "uppercase",
            }}>
              Selected Event
            </label>
            <h2 style={{ fontSize: "1.3rem", margin: "4px 0 12px 0", color: "var(--primary)" }}>
              {form.gameName}
            </h2>
            <div style={{ display: "flex", gap: "8px" }}>
              <span className="badge badge--primary">{form.category}</span>
              <span className="badge badge--outline">{form.gender}</span>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: "30px", display: "grid", gap: "15px" }}>
            <div className="form__group">
              <label className="form__label">Game Name</label>
              <select className="form__select" value={form.gameName} onChange={handleChange("gameName")}>
                <option value="">Select game...</option>
                {gamesList.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form__row">
              <div className="form__group">
                <label className="form__label">Category</label>
                <select className="form__select" value={form.category} onChange={handleChange("category")}>
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form__group">
                <label className="form__label">Gender</label>
                <select className="form__select" value={form.gender} onChange={handleChange("gender")}>
                  <option value="">Select...</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "20px" }}>
            {[
              { id: "gold",   label: "Gold Medalist",   icon: "🥇" },
              { id: "silver", label: "Silver Medalist", icon: "🥈" },
              { id: "bronze", label: "Bronze Medalist", icon: "🥉" },
            ].map((medal) => (
              <div key={medal.id} className="form__group">
                <label className="form__label" style={{ fontWeight: 700 }}>
                  {medal.icon} {medal.label}
                </label>
                <select
                  className="form__select"
                  value={form[medal.id]}
                  onChange={handleChange(medal.id)}
                  required
                >
                  <option value="">Select House...</option>
                  {HOUSES.map((h) => <option key={h} value={h}>{h} House</option>)}
                </select>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={saving}
            style={{ marginTop: "32px", padding: "16px", fontSize: "1rem" }}
          >
            {saving ? "Processing..." : "Confirm & Submit Score"}
          </button>

          <button
            type="button"
            className="btn btn--ghost btn--full"
            onClick={() => navigate(-1)}
            style={{ marginTop: "12px" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SubmitSingle;
