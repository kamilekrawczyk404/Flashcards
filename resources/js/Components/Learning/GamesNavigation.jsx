import { CancelButton } from "../Modals/CancelButton.jsx";
import { useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

const GamesNavigation = ({
  className = "",
  children,
  set,
  isRedirect = true,
  ...props
}) => {
  const { properties } = useContext(ThemeContext);

  return (
    <div
      className={
        properties.container +
        " border-b-2 flex justify-between items-center py-6 xl:px-[20%] lg:px-[10%] sm:px-[1rem] px-[.5rem]"
      }
    >
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