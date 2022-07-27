import { ChangeEventHandler } from "react";

const Spinner: React.FC<{
  step?: number;
  min?: number;
  max?: number;
  value: number;
  label?: string;
  onChange?: (value: number) => void;
}> = (props) => {
  const step = props.step ?? 1;
  const min = props.min ?? 3;
  const max = props.max ?? 10;
  const { value, label, onChange } = props;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (onChange) {
      const numeric = parseInt(e.target.value);
      if (!isNaN(numeric)) onChange(numeric);
    }
  };

  const handleMinus = () => {
    if (props.value <= min || !onChange) return;
    onChange(props.value - 1);
  };

  const handlePlus = () => {
    if (props.value >= max || !onChange) return;
    onChange(props.value + 1);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <label className="font-medium text-sm text-white">{label}</label>}
      <div className="flex flex-row gap-4 items-center">
        <button
          disabled={value === min}
          className="w-10 h-10 bg-white disabled:bg-gray-400 font-medium text-xl hover:disabled:scale-100 hover:scale-105 rounded-full"
          onClick={handleMinus}
        >
          -
        </button>
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          disabled
          className="w-48 px-4 disabled:bg-white font-medium text-lg text-center h-12 rounded-full"
          value={props.value}
          onChange={handleChange}
        ></input>
        <button
          disabled={value === max}
          className="w-10 h-10 bg-white disabled:bg-gray-400 font-medium text-xl hover:disabled:scale-100 hover:scale-105 rounded-full"
          onClick={handlePlus}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Spinner;
