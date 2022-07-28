const SouthEastIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M5,6.41L6.41,5L17,15.59V9H19V19H9V17H15.59L5,6.41Z"
        />
      </svg>
    </div>
  );
};

export default SouthEastIcon;
