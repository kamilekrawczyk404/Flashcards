import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useContext, useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";
import { usePage } from "@inertiajs/react";
import { ThemeContext } from "@/ThemeContext.jsx";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export const SuccessModal = ({ feedback = {} }) => {
  let modalRef = useRef(null);
  const { properties } = useContext(ThemeContext);

  useLayoutEffect(() => {
    if (feedback.success) {
      let modalAnimation = new Animation([modalRef.current]);
      modalAnimation.animateModal("", "<-.5");
    }
  }, []);

  return (
    <>
      {feedback.success && (
        <div
          ref={modalRef}
          className={`${properties.container} fixed top-[100vh] transform md:right-[2rem] right-0 md:translate-x-1 md:translate-y-0 p-6 md:w-fit w-full items-center gap-4 rounded-md shadow-xl opacity-0 hidden overflow-hidden`}
        >
          <FontAwesomeIcon
            icon={faCircleCheck}
            className={"text-lime-500 text-3xl"}
          />
          <p className={`${properties.text} font-semibold text-xl`}>
            {feedback.success}.
          </p>
          <div
            className={"absolute bottom-0 left-0 w-full h-[.25rem] bg-lime-500"}
          ></div>
          <div
            className={"absolute top-0 left-0 w-full h-[.25rem] bg-lime-500"}
          ></div>
        </div>
      )}
    </>
  );
};