import { useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const CurrentIndexIndicator = ({ index, length }) => {
  const { properties } = useContext(ThemeContext);
  return (
    <span className={properties.text + " absolute top-3 right-3 text-sm"}>
      {index + 1} / {length}
    </span>
  );
};