import { ReactNode } from "react";
import Footer from "./footer";
import Title from "./title";

const Header = () => {
  return <div className="h-12 p-2 flex flex-row">
    <Title small={true}></Title>
  </div>;
};

const Container: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-brand justify-between">
      <div>
        <Header />
        <div className="flex flex-col justify-start h-full">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Container;
