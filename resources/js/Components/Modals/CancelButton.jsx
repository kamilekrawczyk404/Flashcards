import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
      <FontAwesomeIcon icon={faXmark} />
    </Link>
  );
};