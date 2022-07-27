import { ReactNode } from "react";

const Container: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return <div className="body-bg min-h-screen w-screen">{children}</div>;
};

export default Container;
