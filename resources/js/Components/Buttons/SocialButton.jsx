import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const SocialButton = ({
  activeSocial,
  handleSetActiveSocial,
  handleDeleteSocial,
  element,
  isDefaultUser,
  usedInForm = false,
  hasRemovingButton = false,
  isDeleting = false,
  ...props
}) => {
  return usedInForm ? (
    <button
      {...props}
      type={"button"}
      className={
        activeSocial === element.name &&
        `relative before:absolute before:bg-indigo-500 before:-bottom-2 before:left-1/2 before:transform before:-translate-x-1/2 before:w-3 before:aspect-square before:rounded-full before:transition`
      }
      onClick={() => {
        handleSetActiveSocial(element.name);
      }}
    >
      <FontAwesomeIcon
        icon={element.icon}
        className={`aspect-square h-[2.875rem] mt-1 ${element.color}`}
      />
    </button>
  ) : (
    <>
      <div {...props} className={"relative"}>
        <FontAwesomeIcon
          icon={element.icon}
          className={`aspect-square h-[3.5rem] mt-1 ${element.color}`}
        />
        <button
          disabled={isDeleting || isDefaultUser}
          type="button"
          className={`absolute -top-2 -right-3 rounded-full bg-red-600 w-7 aspect-square ${
            isDefaultUser ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={(e) => {
            handleDeleteSocial(e, element.name);
          }}
        >
          <FontAwesomeIcon icon={faXmark} className={"text-gray-100"} />
        </button>
      </div>
    </>
  );
};