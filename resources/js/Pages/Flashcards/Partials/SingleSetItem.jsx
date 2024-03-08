import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";

export const SingleSetItem = ({ icon, count = "", text = "" }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let animation = new Animation([ref.current]);
        animation.animateAll("", "", "+.2");
      }
    });
    observer.observe(ref.current);
  }, []);

  return (
    <div className={"relative"}>
      <FontAwesomeIcon
        icon={icon}
        className={
          "absolute aspect-square left-[.65rem] top-1/2 -translate-y-1/2 text-gray-100 text-xl"
        }
      />
      <div
        ref={ref}
        className={
          "text-indigo-500 font-semibold ml-[3.25rem] polygon-from-top opacity-0 -translate-y-4"
        }
      >
        {count} {text}
      </div>
    </div>
  );
};