import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "@/ThemeContext.jsx";

export const EditButton = ({ className = "", ...props }) => {
  const { properties } = useContext(ThemeContext);
  return (
    <button
      type={"button"}
      {...props}
      className={properties.contrastText + " text-2xl " + className}
    >
      <FontAwesomeIcon icon={faPenToSquare} />
    </button>
  );
};