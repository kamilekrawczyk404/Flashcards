import { Link } from "@inertiajs/react";
import { forwardRef } from "react";

export const TestLink = forwardRef(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={
          "min-w-fit md:w-1/3 w-full polygon-start translate-y-12 opacity-0 "
        }
      >
        <Link
          {...props}
          className={
            "flex items-center px-4 py-3 rounded-md text-gray-600 hover:text-gray-700 [&>*]:hover:text-gray-700 bg-gradient-to-tl from-indigo-600 to-indigo-300 font-medium hover:shadow-lg hover:bg-right stretched-bg-image transition-all duration-[.5s] " +
            className
          }
        >
          {children}
        </Link>
      </div>
    );
  },
);