import { forwardRef, useState } from "react";
import match from "@/Pages/Flashcards/Match.jsx";

export const ProgressBars = forwardRef(
  ({ length, translationsLength, bar }, ref) => {
    return (
      <div className={"space-y-2 text-gray-700"}>
        <p>{bar.text}</p>
        <div className={"w-full relative rounded-md"}>
          <div
            style={{
              width: `${Math.floor((length / translationsLength) * 100)}%`,
            }}
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