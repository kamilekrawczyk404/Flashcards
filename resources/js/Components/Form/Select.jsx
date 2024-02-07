import { forwardRef } from "react";

export const Select = forwardRef(
    ({ id, className = "", options, ...props }, ref) => {
        return (
            <select
                {...props}
                id={id}
                ref={ref}
                className={
                    "border border-gray-300 text-gray-900 text-md rounded-lg focus:border-indigo-500 focus:ring-indigo-500 p-2.5 " +
                    className
                }
            >
                {options.map((option, index) => {
                    return (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        );
    },
);