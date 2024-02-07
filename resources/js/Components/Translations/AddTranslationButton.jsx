import { forwardRef } from "react";

export const AddTranslationButton = forwardRef(
    ({ handleAppendField, ...props }, ref) => {
        return (
            <div
                ref={ref}
                onClick={() => handleAppendField()}
                className={
                    "text-center py-8 border-gray-300 border-[3px] rounded-md w-full cursor-pointer shadow-md hover:text-indigo-500 hover:border-indigo-500 transition hover:shadow-lg opacity-0 polygon-start translate-y-12"
                }
            >
                <span className="uppercase font-semibold text-xl tracking-widest">
                    Add card
                </span>
            </div>
        );
    },
);