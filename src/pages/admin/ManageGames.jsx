import { useState, useEffect } from "react";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import Modal from "../../components/Modal.jsx";
import { useToast } from "../../components/Toast.jsx";

const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
const GENDERS    = ["Boys", "Girls", "Mixed"];
const defaultForm = { name: "", categories: [], genders: [] };

const ManageGames = () => {
  const [games,  setGames]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchGames = () => {
    api.get("api/games?limit=200")
      .then(({ data }) => setGames(data.games || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGames(); }, []);

  const toggleCheck = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleCreate = async () => {
    if (!form.name || !form.categories.length || !form.genders.length) {
      return toast("Fill in all fields", "error");
    }
    setSaving(true);
    try {
      await api.post("api/games", {
        name: form.name,
        categories: form.categories,
        genders: form.genders,
      });
      toast("Game(s) created!", "success");
      setModal(false);
      setForm(defaultForm);
      fetchGames();
    } catch (err) {
      toast(err.response?.data?.message || "Failed", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (gameId, name) => {
    if (!confirm(`Delete all variants of "${name}"?`)) return;
    try {
      await api.delete(`api/games/delete/${gameId}`);
      toast("Deleted", "success");
      fetchGames();
    } catch { toast("Failed to delete", "error"); }
  };

  const grouped = games.reduce((acc, g) => {
    if (!acc[g.gameId]) acc[g.gameId] = { name: g.name, gameId: g.gameId, variants: [] };
    acc[g.gameId].variants.push(g);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="page__header--row">
        <div>
          <h1 className="page__title">Manage Games</h1>
          <p className="page__subtitle">Create, edit, and delete events</p>
        </div>
        <button className="btn btn--primary" onClick={() => setModal(true)}>
          + New Game
        </button>
      </div>

      {loading ? (
        <div className="loading-screen" style={{ height: 300 }}>
          <div className="spinner" />
        </div>
      ) : Object.values(grouped).length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: 60 }}>
          No games yet. Click "+ New Game" to create one.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.values(grouped).map(({ name, gameId, variants }) => (
            <div key={gameId} className="form" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "16px 20px",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, marginBottom: 6, fontSize: "0.95rem" }}>
                  {name}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {variants.map((v) => (
                    <span key={`${v.category}-${v.gender}`} className="game-card__tag">
                      {v.category} · {v.gender}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="btn btn--danger btn--sm"
                onClick={() => handleDelete(gameId, name)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title="Create New Game"
          onClose={() => { setModal(false); setForm(defaultForm); }}
          footer={
            <>
              <button className="btn btn--ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleCreate} disabled={saving}>
                {saving ? "Creating…" : "Create"}
              </button>
            </>
          }
        >
          <div className="form__group">
            <label className="form__label">Game Name</label>
            <input
              className="form__input"
              placeholder="e.g. 100m Sprint"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form__group">
            <label className="form__label">Categories</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <label key={c} style={{
                  display: "flex", alignItems: "center",
                  gap: 6, cursor: "pointer", fontSize: "0.88rem",
                }}>
                  <input
                    type="checkbox"
                    checked={form.categories.includes(c)}
                    onChange={() => toggleCheck("categories", c)}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div className="form__group">
            <label className="form__label">Genders</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {GENDERS.map((g) => (
                <label key={g} style={{
                  display: "flex", alignItems: "center",
                  gap: 6, cursor: "pointer", fontSize: "0.88rem",
                }}>
                  <input
                    type="checkbox"
                    checked={form.genders.includes(g)}
                    onChange={() => toggleCheck("genders", g)}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default ManageGames;