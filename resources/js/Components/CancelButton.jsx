import { Link } from "@inertiajs/react";

export const CancelButton = ({
    className = "",
    modalId = "",
    isModal = false,
    ...props
}) => {
    return (
        <Link
            {...props}
            className={
                "text-gray-900 rounded-md bg-gray-100 text-xl flex items-center justify-between px-2 py-[6px] hover:bg-gray-200 transition shadow-md " +
                className
            }
        >
            <i className="fa-solid fa-xmark"></i>
        </Link>
    );
};