import { createContext, useContext, useEffect, useState } from "react";

const FontSizeContext = createContext<any>(null);

export const FontSizeProvider = ({ children }: any) => {
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fontSize") || "medium";
    }
    return "medium";
  });

  useEffect(() => {
    document.documentElement.classList.remove("font-small", "font-medium", "font-large");

    document.documentElement.classList.add(`font-${fontSize}`);

    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
