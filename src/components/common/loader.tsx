const Loader: React.FC<{ color?: string }> = ({ color }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className={`spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full ${color}`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
