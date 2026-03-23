const MedalBadge = ({ type, count }) => (
  <span className={`medal-badge medal-badge--${type}`}>
    <span className="medal-badge__dot" />
    {type.charAt(0).toUpperCase() + type.slice(1)} {count !== undefined && `×${count}`}
  </span>
);

export default MedalBadge;