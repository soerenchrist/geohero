import { ReactNode } from "react";

const Card: React.FC<{
  title: string;
  width?: string;
  children?: ReactNode;
  onClick?: () => void;
}> = ({ title, width, children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg transition-all flex flex-col gap-3 justify-start p-6 items-center text-center bg-gradient-to-br from-accent1 to-accent2 ${
        width ?? "w-full"
      } ${onClick ? "cursor-pointer hover:scale-105" : ""}`}
    >
      <div className="text-2xl font-bold">{title}</div>
      <div>{children}</div>
    </div>
  );
};

export default Card;
