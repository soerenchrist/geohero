import { KeyboardEventHandler } from "react";
import SendIcon from "../icons/send";

const CountryNameInput: React.FC<{
  error?: string;
  name: string;
  onChange: (name: string) => void;
  onEnter: (name: string) => void;
}> = ({ error, name, onEnter, onChange }) => {
  const handleKeys: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onEnter(name);
    }
  };
  return (
    <div className="flex">
      <input
        className={`w-72 px-4 font-medium text-lg text-center h-16 rounded-l-full ${
          error
            ? "border-red-500 bg-red-100 placeholder:text-red-600"
            : "placeholder:text-gray-400"
        }`}
        value={name}
        onKeyDown={handleKeys}
        placeholder={error || "Enter country name"}
        onChange={(e) => onChange(e.target.value)}
      ></input>
      <button
        className="w-16 h-16 rounded-r-full  bg-gradient-to-br from-pink-300 to-rose-500"
        onClick={() => onEnter(name)}
      >
        <SendIcon className="w-6 h-6 m-auto text-white" />
      </button>
    </div>
  );
};

export default CountryNameInput;
