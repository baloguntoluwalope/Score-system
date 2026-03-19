import { useState } from "react";
import api from "../../api/axios.jsx";
import Layout from "../../components/Layout.jsx";
import { useToast } from "../../components/Toast.jsx";

const ResetLeaderboard = () => {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleReset = async () => {
    if (confirm !== "RESET") return toast("Type RESET to confirm", "error");
    setLoading(true);
    try {
      await api.delete("/games/leaderboard/reset");
      toast("Leaderboard reset successfully", "success");
      setConfirm("");
    } catch { toast("Reset failed", "error"); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="page__header">
        <h1 className="page__title">Reset Leaderboard</h1>
        <p className="page__subtitle">This clears ALL scores permanently</p>
      </div>

      <div className="form" style={{
        maxWidth: 480,
        borderTop: "4px solid var(--error)",
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⚠️</div>
        <h3 style={{ color: "var(--error)", marginBottom: 8, fontSize: "1.1rem" }}>
          Danger Zone
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 24 }}>
          This will reset all house points and medals to zero across every game.
          This action cannot be undone.
        </p>
        <div className="form__group">
          <label className="form__label">
            Type <strong>RESET</strong> to confirm
          </label>
          <input
            className="form__input"
            placeholder="RESET"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.toUpperCase())}
          />
        </div>
        <button
          className="btn btn--danger btn--full"
          onClick={handleReset}
          disabled={loading || confirm !== "RESET"}
          style={{ padding: "13px", fontSize: "1rem" }}
        >
          {loading ? "Resetting…" : "Reset All Scores"}
        </button>
      </div>
    </Layout>
  );
};

export default ResetLeaderboard;