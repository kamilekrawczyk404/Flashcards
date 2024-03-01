import { forwardRef } from "react";

export const AnimatedCheckbox = forwardRef(({ children, ...props }, ref) => {
  return (
    <label className="relative w-12 h-6 bg-white rounded-full cursor-pointer">
      <input ref={ref} type="checkbox" className={"sr-only peer"} {...props} />
      <span className="absolute bg-gray-200 rounded-full left-[3px] top-1/2 transform -translate-y-1/2 w-[1.25rem] aspect-square peer-checked:bg-indigo-500 peer-checked:left-[25px] transition-all duration-500"></span>
    </label>
  );
});