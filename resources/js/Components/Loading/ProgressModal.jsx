import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePage } from "@inertiajs/react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";

export const ProgressModal = ({
  inProgress = false,
  errors = {},
  text = "",
}) => {
  const { properties } = useContext(ThemeContext);
  return (
    <>
      {Object.values(errors).every((value) => !Object.keys(value).length) &&
        inProgress && (
          <div
            className={
              properties.background +
              " absolute top-0 left-0 w-full h-screen z-[200]"
            }
          >
            <div
              className={
                "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-amber-500 p-4 rounded-md sm:w-fit w-full"
              }
            >
              <FontAwesomeIcon
                icon={faHourglassStart}
                className={"animate-hourglass text-2xl mr-4 text-gray-700"}
              />
              <p className={"text-2xl text-gray-700"}>
                <span className={"font-bold"}>Wait a second</span>. {text}
              </p>
            </div>
          </div>
        )}
    </>
  );
};