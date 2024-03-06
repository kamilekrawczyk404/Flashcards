import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "pt-1 px-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none relative " +
                (active
                    ? "before:absolute before:bottom-[-1.3rem] before:left-0 before:bg-indigo-500 before:w-full before:h-[.125rem] before:z-10 "
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 ") +
                className
            }
        >
            {children}
        </Link>
    );
}