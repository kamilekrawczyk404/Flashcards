import { button } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphonesSimple } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "@/ThemeContext.jsx";

export const SoundButton = ({ className = "", audioPath, ...props }) => {
  const { properties } = useContext(ThemeContext);
  const [isGettingData, setIsGettingData] = useState(false);

  const playSound = async (e) => {
    e.stopPropagation();

    if (audioPath) {
      setIsGettingData(true);
      await new Audio(audioPath).play();
      setIsGettingData(false);
    }
  };

  return (
    <>
      {audioPath && (
        <>
          <button
            onClick={(e) => playSound(e)}
            className={
              properties.text +
              " text-2xl rounded-full relative before:absolute before:top-1/2 before:left-1/2 before:w-[20px] before:rounded-full before:h-[20px] before:transform before:-translate-x-1/2 before:-translate-y-1/2 " +
              (isGettingData ? "before:animate-pulse-loading " : "") +
              className
            }
            {...props}
            disabled={isGettingData}
          >
            <FontAwesomeIcon icon={faHeadphonesSimple} />
          </button>
        </>
      )}
    </>
  );
};