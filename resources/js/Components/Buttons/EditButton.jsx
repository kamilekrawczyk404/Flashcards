import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export const EditButton = ({ className = "", ...props }) => {
  return (
    <button type={"button"} {...props} className={"text-2xl " + className}>
      <FontAwesomeIcon icon={faPenToSquare} />
    </button>
  );
};