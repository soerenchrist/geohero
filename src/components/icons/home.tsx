const HomeIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
        />
      </svg>
    </div>
  );
};

export default HomeIcon;