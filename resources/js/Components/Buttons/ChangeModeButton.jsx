import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { AnimatedCheckbox } from "@/Components/Form/AnimatedCheckbox.jsx";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const ChangeModeButton = ({ className = "" }) => {
  const { properties, changeMode } = useContext(ThemeContext);
  const [checked, setChecked] = useState(properties.mode === "dark");

  useEffect(() => {
    setChecked(properties.mode === "dark");
  }, [properties]);

  return (
    <div
      className={`${properties.text} flex items-center gap-x-2 text-xl ${className}`}
    >
      <FontAwesomeIcon icon={faSun} />
      <AnimatedCheckbox checked={checked} onChange={() => changeMode()} />
      <FontAwesomeIcon icon={faMoon} />
    </div>
  );
};