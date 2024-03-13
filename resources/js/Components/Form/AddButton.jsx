import { forwardRef, useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const AddButton = forwardRef(
  ({ className = "", text, ...props }, ref) => {
    const { properties } = useContext(ThemeContext);

    return (
      <button
        {...props}
        type={"button"}
        ref={ref}
        className={
          properties.text +
          " text-center border-gray-300 border-[3px] rounded-md w-full cursor-pointer shadow-md hover:text-indigo-500 hover:border-indigo-500 transition hover:shadow-lg " +
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