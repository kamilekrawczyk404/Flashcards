import { forwardRef } from "react";

export const AddButton = forwardRef(
  ({ className = "", text, ...props }, ref) => {
    return (
      <button
        {...props}
        type={"button"}
        ref={ref}
        className={
          "text-center border-gray-300 border-[3px] rounded-md w-full cursor-pointer shadow-md hover:text-indigo-500 hover:border-indigo-500 transition hover:shadow-lg " +
          className
        }
      >
        <span className="uppercase font-semibold text-xl tracking-widest">
          {text}
        </span>
      </button>
    );
  },
);