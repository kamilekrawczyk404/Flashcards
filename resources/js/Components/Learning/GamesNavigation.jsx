import { CancelButton } from "../CancelButton.jsx";

const GamesNavigation = ({
    className = "",
    children,
    set,
    isRedirect = true,
    ...props
}) => {
    return (
        <div className="bg-white border-b-2 flex justify-between py-6 md:px-40 sm:px-20 px-6">
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {children}
            </h2>
            <CancelButton
                {...props}
                href={
                    isRedirect
                        ? route("flashcards.showSet", [set.id, set.title])
                        : ""
                }
            />
        </div>
    );
};
export default GamesNavigation;