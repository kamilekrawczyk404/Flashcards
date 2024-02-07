import { Link } from "@inertiajs/react";

export const TestLink = ({ className = "", children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                "flex items-center px-4 py-3 bg-gray-100 rounded-md hover:text-indigo-500 [&>*]:hover:text-indigo-500 hover:bg-gray-200 transition font-medium " +
                className
            }
        >
            {children}
        </Link>
    );
};