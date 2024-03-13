import { forwardRef, useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const Container = forwardRef(({ className, children }, ref) => {
  const { properties } = useContext(ThemeContext);

  return (
    <div
      ref={ref}
      className={
        properties.container +
        " relative overflow-hidden md:max-w-[62rem] max-w-[76rem] sm:p-4 p-2 shadow-sm sm:rounded-md lg:mx-auto " +
        className
      }
    >
      {children}
    </div>
  );
});