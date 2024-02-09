import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";

export const SuccessModal = ({ feedback = false, text = "" }) => {
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
            "absolute transform right-1/2 translate-x-1/2 md:right-[5rem] md:translate-x-0 translate-y-0 p-6 w-auto bg-white items-center gap-4 rounded-md shadow-xl opacity-0 hidden"
          }
        >
          <FontAwesomeIcon
            icon="fa-solid fa-circle-check"
            className={"text-lime-500 text-3xl"}
          />
          <p className={"font-semibold text-gray-700 text-xl"}>
            {feedback.success}.
          </p>
        </div>
      )}
    </>
  );
};