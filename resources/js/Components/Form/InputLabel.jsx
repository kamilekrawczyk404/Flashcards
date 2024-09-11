import { useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export default function InputLabel({
  value,
  className = "",
  children,
  ...props
}) {
  const { properties } = useContext(ThemeContext);

  return (
    <label
      className={properties.text + ` block font-medium text-md ` + className}
      {...props}
    >
      {value ? value : children}
    </label>
  );
}