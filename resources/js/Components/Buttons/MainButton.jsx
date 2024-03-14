import { Link } from "@inertiajs/react";

export const MainButton = ({
  className = "",
  isClicked,
  isRedirect = false,
  children,
  ...props
}) => {
  const styling =
    " px-4 py-2 rounded-md text-lg transition font-semibold shadow-sm inline-block w-fit whitespace-nowrap ";
  return isRedirect ? (
    <Link {...props} className={styling + className}>
      {children}
    </Link>
  ) : (
    <button
      {...props}
      className={
        (isClicked && "opacity-1 animate-show-from-bottom ") +
        styling +
        className
      }
    >
      {children}
    </button>
  );
};