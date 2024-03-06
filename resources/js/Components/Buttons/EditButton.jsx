import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const EditButton = ({ className = "", ...props }) => {
    return (
        <button type={"button"} {...props} className={"text-2xl " + className}>
            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
        </button>
    );
};