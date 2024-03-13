import { useEffect, forwardRef, useRef, useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export default forwardRef(function Textarea(
  { value, className = "", isFocused = false, error = false, ...props },
  ref,
) {
  const { properties } = useContext(ThemeContext);
  const textarea = ref ? ref : useRef();

  useEffect(() => {
    if (isFocused) {
      textarea.current.focus();
    }
  }, []);
  return (
    <textarea
      rows="4"
      className={
        properties.container +
        " " +
        properties.text +
        " block p-2.5 w-full rounded-md shadow-sm border border-gray-300 min-h-fit max-h-48 " +
        " " +
        (error ? "bg-red-400 bg-opacity-60 " : "") +
        className
      }
      {...props}
      ref={textarea}
    ></textarea>
  );
});