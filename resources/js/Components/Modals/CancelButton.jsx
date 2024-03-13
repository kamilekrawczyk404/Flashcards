import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const CancelButton = ({
  className = "",
  modalId = "",
  isModal = false,
  ...props
}) => {
  const { properties } = useContext(ThemeContext);
  return (
    <Link
      {...props}
      className={
        properties.contrastBackground +
        " " +
        properties.contrastText +
        " rounded-md text-xl flex items-center justify-between px-2 py-[6px] hover:brightness-75 transition shadow-md " +
        className
      }
    >
      <FontAwesomeIcon icon={faXmark} />
    </Link>
  );
};