import React from "react";

export const EditButton = ({ className = "", ...props }) => {
    return (
        <button type={"button"} {...props} className={"text-2xl " + className}>
            <i className={"fa-regular fa-pen-to-square"}></i>
        </button>
    );
};