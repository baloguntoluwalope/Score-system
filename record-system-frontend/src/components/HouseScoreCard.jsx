import MedalBadge from "../components/MedalBadge.jsx";

const HouseScoreCard = ({ house, points, medals }) => (
  <div className={`house-score-card ${house.toLowerCase()}`}>
    <div className="house-score-card__name">{house} House</div>
    <div className="house-score-card__points">{points}</div>
    <div className="house-score-card__medals">
      <MedalBadge type="gold"   count={medals?.gold} />
      <MedalBadge type="silver" count={medals?.silver} />
      <MedalBadge type="bronze" count={medals?.bronze} />
    </div>
  </div>
);

export default HouseScoreCard;