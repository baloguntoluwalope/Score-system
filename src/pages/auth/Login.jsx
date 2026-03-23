import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../components/Toast.jsx";

const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const { loginAdmin, loginJudge } = useAuth();
  const navigate = useNavigate();
  const toast    = useToast();

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);

    try {
      // ✅ Try admin first
      const user = await loginAdmin(email, password);
      toast(`Welcome, ${user.name}!`, "success");
      navigate("/admin");
    } catch (adminErr) {
      // ✅ Admin failed — now try judge
      // Only redirect if it's not a credentials error (404, 500 etc.)
      const adminStatus = adminErr.response?.status;

      // If server is down entirely, stop here
      if (!adminErr.response) {
        toast("Server unreachable. Please try again.", "error");
        setLoading(false);
        return;
      }

      try {
        const user = await loginJudge(email, password);
        toast(`Welcome, ${user.name}!`, "success");
        navigate("/judge");
      } catch (judgeErr) {
        // Both failed — show error
        const msg =
          judgeErr.response?.data?.message ||
          adminErr.response?.data?.message  ||
          "Invalid email or password";
        toast(msg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          padding: 24px 16px;
        }
        .login-box {
          width: 100%;
          max-width: 420px;
        }
        .login-logo {
          text-align: center;
          margin-bottom: 36px;
        }
        .login-logo__icon  { font-size: 3.5rem; display: block; margin-bottom: 10px; }
        .login-logo__title { color: #fff; font-size: 1.9rem; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.5px; }
        .login-logo__sub   { color: rgba(255,255,255,0.65); font-size: 0.92rem; }

        .login-card {
          background: #fff;
          border-radius: var(--radius);
          padding: 28px 24px;
          box-shadow: var(--shadow-lg);
          margin-bottom: 16px;
        }
        .login-card__title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--border);
        }
        .login-submit {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: var(--radius-sm);
          background: var(--primary);
          color: #fff;
          cursor: pointer;
          transition: opacity 0.2s;
          margin-top: 8px;
        }
        .login-submit:hover:not(:disabled) { opacity: 0.88; }
        .login-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .login-public {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
        }
        .login-public__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 13px 20px;
          border-radius: var(--radius);
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          transition: all 0.2s;
          box-sizing: border-box;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.85);
        }
        .login-public__btn:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.5);
          color: #fff;
        }
        .login-footer {
          text-align: center;
          margin-top: 20px;
          color: rgba(255,255,255,0.3);
          font-size: 0.75rem;
        }
        @media (max-width: 480px) {
          .login-logo__title { font-size: 1.5rem; }
          .login-logo__icon  { font-size: 2.8rem; }
          .login-card        { padding: 22px 18px; }
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-box">

          {/* ── Logo ───────────────────────────────────────────────────── */}
          <div className="login-logo">
            <span className="login-logo__icon">🏆</span>
            <h1 className="login-logo__title">School Sports Day</h1>
            <p className="login-logo__sub">Sign in to continue</p>
          </div>

          {/* ── Login card ─────────────────────────────────────────────── */}
          <div className="login-card">
            <p className="login-card__title">🔐 Sign In</p>

            <div className="form__group">
              <label className="form__label">Email Address</label>
              <input
                className="form__input"
                type="email"
                placeholder="you@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="form__group" style={{ marginBottom: 4 }}>
              <label className="form__label">Password</label>
              <input
                className="form__input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <button
              className="login-submit"
              onClick={handleSubmit}
              disabled={loading || !email || !password}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>

          {/* ── Public links ───────────────────────────────────────────── */}
          <div className="login-public">
            <a href="api/leaderboard" className="login-public__btn">
              🏆 View Live Leaderboard
            </a>
            <a href="api/" className="login-public__btn">
              🎮 Browse All Events
            </a>
          </div>

          <p className="login-footer">Unauthorized access is prohibited</p>

        </div>
      </div>
    </>
  );
};

export default Login;
