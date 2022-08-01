import { useEffect, useState } from "react";

export const useUsername = () => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const localName = localStorage.getItem("username");
    if (localName) {
      setName(localName);
    }
  }, []);

  const saveName = () => {
    if (!name) return;
    localStorage.setItem("username", name);
    setName(name);
  };

  return {
    name,
    setName,
    saveName,
  };
};