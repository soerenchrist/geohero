import { ChangeEventHandler } from "react";

const Checkbox: React.FC<{
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}> = ({ checked, onChange, label }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <input
        type="checkbox"
        className="bg-white w-6 h-6 rounded-full border-purple-300 text-accent1 focus:ring-0"
        checked={checked}
        onChange={handleChange}
      ></input>
      {label && <label className="font-medium text-sm text-white">{label}</label>}
    </div>
  );
};

export default Checkbox;
