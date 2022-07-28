const NorthWestIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,17.59L17.59,19L7,8.41V15H5V5H15V7H8.41L19,17.59Z"
        />
      </svg>
    </div>
  );
};

export default NorthWestIcon;
