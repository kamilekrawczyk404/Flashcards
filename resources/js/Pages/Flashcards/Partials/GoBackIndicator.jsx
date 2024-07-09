import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const GoBackIndicator = ({
  onRight = false,
  handleAnimate,
  onMoved = () => {},
}) => {
  return (
    <button
      onClick={() => {
        handleAnimate(true);
        onMoved();
      }}
      type={"button"}
      className={
        "absolute top-0 transform hover:bg-indigo-600 transition text-3xl flex items-center justify-center text-gray-100 bg-indigo-500 md:h-screen h-10 md:w-fit w-full px-4 " +
        (onRight ? "left-0 rotate-180 " : "right-0")
      }
    >
      <FontAwesomeIcon icon={faArrowRight} />
    </button>
  );
};