import { ReactNode } from "react";

const Container: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return <div className="bg-brand min-h-screen w-screen">{children}</div>;
};

export default Container;
