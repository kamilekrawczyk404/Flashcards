import { button } from "@material-tailwind/react";
import { useState } from "react";

export const SoundButton = ({ className = "", audioPath, ...props }) => {
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
                            "text-2xl rounded-full relative before:absolute before:top-1/2 before:left-1/2 before:w-[20px] before:rounded-full before:h-[20px] before:transform before:-translate-x-1/2 before:-translate-y-1/2 " +
                            (isGettingData
                                ? "before:animate-pulse-loading "
                                : "") +
                            className
                        }
                        {...props}
                        disabled={isGettingData}
                    >
                        <i className="fa-solid fa-headphones"></i>
                    </button>
                </>
            )}
        </>
    );
};