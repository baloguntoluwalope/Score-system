import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios.jsx";
import GameCard from "../../components/GameCard.jsx";
import Pagination from "../../components/Pagination.jsx";

const CATEGORIES = ["KG", "Nursery", "Primary", "JSS", "SSS", "General"];
const GENDERS = ["Boys", "Girls", "Mixed"];

const Home = () => {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGames = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
      });

      if (category) params.append("category", category);
      if (gender) params.append("gender", gender);

      const response = await api.get(`/games?${params}`);
      const data = response.data;

      setGames(data.games || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching games:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [category, gender, page]);

  const clearFilters = () => {
    setCategory("");
    setGender("");
    setPage(1);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="public-navbar">
        <Link to="/" className="public-navbar__brand">
          🏆 Sports Day
        </Link>

        <div className="public-navbar__links">
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/login">Admin / Judge</Link>
        </div>
      </nav>

      {/* Page */}
      <div className="public-page">

        {/* Header */}
        <div className="page__header">
          <h1 className="page__title">All Events</h1>
          <p className="page__subtitle">
            Live scores from all competitions
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {/* Category Filter */}
          <select
            className="form__select"
            style={{ width: "auto" }}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            className="form__select"
            style={{ width: "auto" }}
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Genders</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(category || gender) && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="loading-screen" style={{ height: 300 }}>
            <div className="spinner" />
          </div>
        ) : games.length === 0 ? (

          /* Empty State */
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              marginTop: 60,
            }}
          >
            No events found.
          </p>

        ) : (
          <>
            {/* Games Grid */}
            <div className="games-grid">
              {games.map((game) => (
                <GameCard
                  key={game._id || game.gameId}
                  game={game}
                  onClick={() =>
                    navigate(`/games/${game.gameId}`)
                  }
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Home;