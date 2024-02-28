import { CancelButton } from "../Modals/CancelButton.jsx";

const GamesNavigation = ({
  className = "",
  children,
  set,
  isRedirect = true,
  ...props
}) => {
  return (
    <div className="bg-white border-b-2 flex justify-between items-center py-6 md:px-[4rem] sm:px-[2rem] px-[1rem]">
      <h2 className="font-semibold text-xl text-gray-800 leading-tight">
        {children}
      </h2>
      <CancelButton
        {...props}
        href={isRedirect ? route("flashcards.showSet", [set.id]) : ""}
      />
    </div>
  );
};
export default GamesNavigation;