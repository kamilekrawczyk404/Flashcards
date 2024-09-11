import { forwardRef, useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const Select = forwardRef(
  ({ id, className = "", options, ...props }, ref) => {
    const { properties } = useContext(ThemeContext);

    return (
      <select
        {...props}
        id={id}
        ref={ref}
        className={`${properties.container} ${properties.text} ${properties.border} text-md rounded-lg focus:border-indigo-500 focus:ring-indigo-500 p-2.5 ${className}`}
      >
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    );
  },
);