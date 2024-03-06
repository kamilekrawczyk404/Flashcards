import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        "absolute right-[1vw] top-1/2 transform -translate-y-1/2 hover:bg-indigo-600 transition text-3xl flex items-center justify-center text-gray-100 bg-indigo-500 w-[2.5rem] aspect-square rounded-full " +
        (onRight ? "left-[1vw] rotate-180 " : "right-[1vw]")
      }
    >
      <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
    </button>
  );
};