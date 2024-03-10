import { forwardRef } from "react";

export const Container = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={
        "relative overflow-hidden md:max-w-[62rem] max-w-[76rem] sm:p-4 p-2 shadow-sm sm:rounded-md lg:mx-auto bg-white " +
        className
      }
    >
      {children}
    </div>
  );
});