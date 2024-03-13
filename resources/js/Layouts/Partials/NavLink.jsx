import { Link } from "@inertiajs/react";
import { useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export default function NavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  const { properties } = useContext(ThemeContext);
  return (
    <Link
      {...props}
      className={
        properties.text +
        " pt-1 px-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none relative " +
        (active
          ? "before:absolute before:bottom-[-1.3rem] before:left-0 before:bg-indigo-500 before:w-full before:h-[.2rem] before:z-10 "
          : "border-transparent hover:text-gray-00 hover:border-gray-300 focus:text-gray-100 focus:border-gray-300 ") +
        className
      }
    >
      {children}
    </Link>
  );
}