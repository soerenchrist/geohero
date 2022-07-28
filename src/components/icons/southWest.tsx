const SouthWestIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z"
        />
      </svg>
    </div>
  );
};

export default SouthWestIcon;
