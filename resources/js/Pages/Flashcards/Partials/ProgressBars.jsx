import { forwardRef, useLayoutEffect, useRef } from "react";
import gsap from "gsap/all";
export const ProgressBars = forwardRef(
  ({ length, translationsLength, bar }, ref) => {
    const barRef = useRef(null);

    useLayoutEffect(() => {
      const barAnimation = gsap.timeline({
        defaults: {
          duration: 1,
          width: `${Math.floor((length / translationsLength) * 100)}%`,
          ease: "power1.inOut",
        },
      });

      barAnimation.to(barRef.current, {}, "+1");
    }, []);
    return (
      <div
        ref={ref}
        className={
          "space-y-2 text-gray-700 opacity-0 translate-y-12 polygon-start"
        }
      >
        <p>{bar.text}</p>
        <div className={"w-full relative h-[.5rem]"}>
          <div
            ref={barRef}
            className={
              "left-0 top-1/2 transform -translate-y-1/2 absolute h-[.5rem] rounded-full z-20 " +
              bar.color
            }
          ></div>
          <div
            className={
              "left-0 top-1/2 transform -translate-y-1/2 absolute h-[.5rem] w-full bg-gray-200 rounded-full z-10"
            }
          ></div>
        </div>
      </div>
    );
  },
);