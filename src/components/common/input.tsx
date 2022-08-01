const Input: React.FC<React.ComponentPropsWithRef<"input">> = (props) => {
  return (
    <input
      className="w-64 px-4 font-medium disabled:bg-gray-100 placeholder:text-gray-400 text-lg text-center h-12 rounded-full"
      {...props}
    />
  );
};

export default Input;
