import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";
import GameCard from "../../components/GameCard.jsx";

const CategoryView = () => {
  const { category, gender } = useParams();
  const [games,   setGames]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/games/${category}/${gender}`)
      .then(({ data }) => setGames(data.games || []))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [category, gender]);

  return (
    <>
      <nav className="public-navbar">
        <Link to="/" className="public-navbar__brand">🏆 Sports Day</Link>
        <div className="public-navbar__links">
          <Link to="/">Events</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>
      </nav>

      <div className="public-page">
        <div className="page__header">
          <h1 className="page__title">{category} — {gender}</h1>
          <p className="page__subtitle">{games.length} event(s) in this category</p>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ height: 300 }}><div className="spinner" /></div>
        ) : (
          <div className="games-grid">
            {games.map((game) => (
              <GameCard key={game.gameId} game={game}
                onClick={() => navigate(`/games/${game.gameId}`)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryView;