import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";
import { usePage } from "@inertiajs/react";

export const SuccessModal = ({ feedback = {} }) => {
  let modalRef = useRef(null);

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
          className={
            "fixed top-[100vh] transform sm:right-1/2 sm:translate-x-1/2 md:right-[2rem] md:translate-x-0 sm:translate-y-0 sm:p-6 p-3 sm:w-auto  w-full left-0 bg-white items-center gap-4 rounded-md shadow-xl opacity-0 hidden overflow-hidden"
          }
        >
          <FontAwesomeIcon
            icon="fa-solid fa-circle-check"
            className={"text-lime-500 text-3xl"}
          />
          <p className={"font-semibold text-gray-700 text-xl"}>
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