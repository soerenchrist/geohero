const NorthEastIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
        />
      </svg>
    </div>
  );
};

export default NorthEastIcon;
