import { Link } from "@inertiajs/react";
import { forwardRef } from "react";

export const ApplicationLogo = forwardRef(({ className }, ref) => {
    return (
        <Link
            ref={ref}
            href={route("home")}
            className={
                "font-bold bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-200 text-transparent animate-logo-animation stretched-bg-image " +
                className
            }
        >
            Flashcards
        </Link>
    );
});