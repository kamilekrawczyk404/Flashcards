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
            "fixed top-[100vh] transform md:right-[2rem] right-0 md:translate-x-1 md:translate-y-0 p-6 md:w-fit w-full bg-white items-center gap-4 rounded-md shadow-xl opacity-0 hidden overflow-hidden"
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