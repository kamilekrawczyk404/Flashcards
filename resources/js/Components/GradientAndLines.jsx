import { forwardRef } from "react";

export const GradientAndLines = forwardRef(
  (
    {
      className = "",
      hasLines = false,
      linesColor = "",
      from = "",
      to = "",
      children,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={
          `bg-gradient-to-tl ${from} ${to} overflow-hidden rounded-md ` +
          (hasLines
            ? `before:absolute before:-right-[40%] before:-bottom-[0%] before:${linesColor} before:w-full before:h-1 before:transform before:-rotate-45 after:absolute after:-right-[40%] after:-bottom-[0%] after:${linesColor} after:w-full after:h-1 after:transform after:-rotate-45 overflow-hidden before:-z-10 after:-z-10 `
            : "") +
          className
        }
      >
        {children}
      </div>
    );
  },
);