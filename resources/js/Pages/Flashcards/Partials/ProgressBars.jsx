import { forwardRef } from "react";

export const ProgressBars = forwardRef(
  ({ title, length, translationsLength }, ref) => {
    return (
      <div>
        <p>{title}</p>
        <div className={"w-full relative rounded-md"}>
          <div
            className={`left-0 top-1/2 transform -translate-y-1/2 absolute h-[.5rem] bg-lime-500 rounded-full z-20 w-[${
              length / translationsLength
            }%]`}
          ></div>
          <div
            className={
              "left-0 top-1/2 transform -translate-y-1/2 absolute h-[.5rem] w-full bg-gray-100 rounded-full z-10"
            }
          ></div>
        </div>
      </div>
    );
  },
);