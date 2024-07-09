import { forwardRef, useContext, useState } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const AnimatedCheckbox = forwardRef(
  ({ className = "", children, ...props }, ref) => {
    const { properties } = useContext(ThemeContext);
    const isDisabled = props?.disabled ?? false;

    return (
      <label
        className={
          `${
            properties.background
          } relative w-12 h-6 border-2 py-[.75rem] rounded-full transition-all duration-500 ${
            isDisabled
              ? `${properties.disabledBorder} cursor-not-allowed`
              : `${properties.border} cursor-pointer`
          } ` + className
        }
      >
        <input
          ref={ref}
          type="checkbox"
          className={"sr-only peer"}
          {...props}
        />
        <span
          className={`absolute rounded-full left-[3px] top-1/2 transform -translate-y-1/2 w-[1.25rem] aspect-square peer-checked:bg-indigo-500 peer-checked:left-[1.3rem] transition-all duration-500 ${
            isDisabled
              ? properties.disabledBackground
              : properties.contrastBackground
          }`}
        ></span>
      </label>
    );
  },
);